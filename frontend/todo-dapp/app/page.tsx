"use client"

import { useState, useEffect } from "react"
import NetworkModal from "./components/NetworkModal"
import TodoList from "./components/TodoList"
import { ethers } from 'ethers'

export default function Home() {
  const [isNetworkSepolia, setIsNetworkSepolia] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)

  useEffect(() => {
    const setUpProvider = async () => {
      if (window.ethereum) {
        try {
          const browserProvider = new ethers.BrowserProvider(window.ethereum)
          setProvider(browserProvider)

          await checkNetwork(browserProvider)

          // Listen for network changes
          window.ethereum.on('chainChanged', async () => {
            const newProvider = new ethers.BrowserProvider(window.ethereum)
            setProvider(newProvider)
            await checkNetwork(newProvider)
          })
        } catch (error) {
          console.error("Error setting up provider:", error)
        }
      } else {
        console.error("No Ethereum wallet detected")
      }
    }

    setUpProvider()
  }, [])

  const checkNetwork = async (browserProvider: ethers.BrowserProvider): Promise<void> => {
    try {
      const network = await browserProvider.getNetwork()
      if (network.chainId === BigInt(11155111)) {
        setIsNetworkSepolia(true)
        setIsModalOpen(false)
      } else {
        setIsNetworkSepolia(false)
        setIsModalOpen(true)
      }
    } catch (error) {
      console.error("Error checking network:", error)
      setIsNetworkSepolia(false)
      setIsModalOpen(true)
    }
  }

  const handleSwitchNetwork = async () => {
    if (provider) {
      try {
        await provider.send('wallet_switchEthereumChain', [{ chainId: '0xaa36a7' }])
        const newProvider = new ethers.BrowserProvider(window.ethereum)
        setProvider(newProvider)
        await checkNetwork(provider)
      } catch (error) {
        console.error("Error switching to Sepolia:", error)
        setIsNetworkSepolia(false)
        setIsModalOpen(true)
      }
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setIsNetworkSepolia(false)
  }

  return (
    <>
      <NetworkModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSwitchNetwork={handleSwitchNetwork}
      />
      {isNetworkSepolia && <TodoList />}
    </>
  )
}
