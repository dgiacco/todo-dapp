"use client"

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const conrtactAddress = ""
const contractABI = [
  // Temporary placeholder, replace with actual ABI later
  {
    type: "function",
    name: "placeholderFunction",
    inputs: [],
    outputs: [],
  },
]

const TodoList = () => {
  const [tasks, setTasks] = useState<{ id: number; content: string; completed: boolean }[]>([])
  const [newTask, setNewTask] = useState('')
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const contract = new ethers.Contract(conrtactAddress, contractABI, signer)
      } else {
        console.error("Ethereum provider not found")
      }

      init()

    }
  }, [])

  return (
    <div>
      <h1>Todo List</h1>
    </div>
  )
};

export default TodoList;
