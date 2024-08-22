"use client"

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'

import { contractAddress, contractABI } from '../utils/contractInfo'
import PendingTxModal from './PendingTxModal'
import Todo from './Todo'
import CustomModal from './common/CustomModal'

const TodoList = () => {
  const [todos, setTodos] = useState<{ id: number; content: string; completed: boolean }[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [contract, setContract] = useState<ethers.Contract | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isTxPending, setIsTxPending] = useState(false)
  const [txSuccessful, setTxSuccessful] = useState(false)
  const [currentHash, setCurrentHash] = useState('')

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' })

        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const contract = new ethers.Contract(contractAddress, contractABI, signer)

        setProvider(provider)
        setContract(contract)

      } else {
        console.error("Ethereum provider not found")
      }
    }
    init()
  }, [])

  useEffect(() => {
    if (contract) {
      fetchTodos()
    }
  }, [contract])

  const fetchTodos = async () => {
    setIsLoading(true)

    if (contract) {
      try {
        const todos = await contract.getTasks()
        setTodos(todos.map((todo: any) => ({
          id: todo.id,
          content: todo.content,
          completed: todo.completed,
        })))
      } catch (error) {
        console.error("Error fetching todos:", error)
      }
    }
    setIsLoading(false)
  }


  const createTodo = async () => {
    if (!contract) {
      console.error("Contract not initialized")
      return
    }

    try {
      const tx = await contract.createTask(newTodo)
      setIsTxPending(true)
      await tx.wait()
      const hash = tx.hash
      setCurrentHash(hash)
      setNewTodo('')
      await fetchTodos()
    } catch (error) {
      console.error("Error creating todo:", error)
    } finally {
      setIsTxPending(false)
      setTxSuccessful(true)
    }
  }

  const completeTodo = async (todoId: number) => {
    if (!contract) {
      console.error("Contract not initialized")
      return
    }
    try {
      const tx = await contract.completeTask(todoId)
      setIsTxPending(true)
      await tx.wait()
      const hash = tx.hash
      setCurrentHash(hash)
      fetchTodos()
    } catch (error) {
      console.error("Error completing todo:", error)
    } finally {
      setIsTxPending(false)
      setTxSuccessful(true)
    }
  }

  const deleteTodo = async (todoId: number) => {
    if (!contract) {
      console.error("Contract not initilized")
      return
    }

    try {
      const tx = await contract.deleteTask(todoId)
      setIsTxPending(true)
      await tx.wait()
      const hash = tx.hash
      setCurrentHash(hash)
      fetchTodos()
    } catch (error) {
      console.error("Error deleting todo:", error)
    } finally {
      setIsTxPending(false)
      setTxSuccessful(true)
    }
  }

  const handleSeeInEtherscan = () => {
    window.open(`https://sepolia.etherscan.io/tx/${currentHash}`, '_blank')
    setCurrentHash('')
    setTxSuccessful(false)
  }

  const handleCloseTxSuccessfulModal = () => {
    setTxSuccessful(false)
  }

  return (
    <div className='p-4'>
      {isTxPending && <PendingTxModal />}
      <CustomModal
        isOpen={txSuccessful}
        onClose={handleCloseTxSuccessfulModal}
        onButtonMethod={handleSeeInEtherscan}
        modalTitle='Transaction successful! 🎉'
        modalMsg='Click to see the transaction details'
        buttonText='See in Etherscan'
      />
      <h1 className="flex justify-center items-center text-5xl font-extrabold mb-8 text-blue-400">
        Todo List Dapp
      </h1>
      <div className='flex justify-center items-center'>
        <div className='mb-4'>
          <input
            type='text'
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            maxLength={75}
            className='border p-2 mr-2 text-black rounded'
            placeholder='New todo'
          />
          <button
            onClick={createTodo}
            className={`px-4 py-2 text-white rounded ${newTodo.trim() ? "bg-blue-600 hover:bg-blue-400" : "bg-gray-400 cursor-not-allowed"}`}
            disabled={!newTodo.trim()}
          >
            Add Todo
          </button>
        </div>
      </div>
      <div className="flex justify-center items-center p-4">
        <ul className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full max-w-screen-lg">
          {isLoading && (
            <div className="flex justify-center items-center h-24 col-span-full">
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-400 fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          )}
          {todos.map(todo => (
            <li key={todo.id} className='flex items-center mb-2'>
              <Todo id={todo.id} completed={todo.completed} content={todo.content} completeTodo={completeTodo} deleteTodo={deleteTodo} />
            </li>
          ))}
        </ul>
      </div>

    </div>
  )
}

export default TodoList
