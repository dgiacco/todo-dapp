"use client"

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { contractAddress, contractABI } from '../utils/contractInfo'

const TodoList = () => {
  const [tasks, setTasks] = useState<{ id: number; content: string; completed: boolean }[]>([])
  const [newTask, setNewTask] = useState('')
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        setProvider(provider);
        setContract(contract);

      } else {
        console.error("Ethereum provider not found");
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (contract) {
      fetchTasks();
    }
  }, [contract])

  const fetchTasks = async () => {
    setIsLoading(true);

    if (contract) {
      try {
        const tasks = await contract.getTasks();
        setTasks(tasks.map((task: any) => ({
          id: task.id,
          content: task.content,
          completed: task.completed,
        })));
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    }
    setIsLoading(false);
  }


  const createTask = async () => {
    if (!contract) {
      console.error("Contract not initialized");
      return;
    }

    try {
      const tx = await contract.createTask(newTask);
      await tx.wait();
      setNewTask('');
      await fetchTasks();
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const completeTask = async (taskId: number) => {
    if (!contract) {
      console.error("Contract not initialized");
      return;
    }

    try {
      const tx = await contract.completeTask(taskId);
      await tx.wait();
      fetchTasks();
    } catch (error) {
      console.error("Error completing task:", error);
    }

  }

  const deleteTask = async (taskId: number) => {
    if(!contract) {
      console.error("Contract not initilized");
      return;
    }

    try {
      const tx = await contract.deleteTask(taskId);
      await tx.wait();
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error)
    }
  }

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Todo List</h1>
      <div className='mb-4'>
        <input
          type='text'
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className='border p-2 mr-2 text-black'
          placeholder='New task'
        />
        <button
          onClick={createTask}
          className='px-4 py-2 bg-blue-500 text-white rounded'
        >
          Add Task
        </button>
      </div>
      <ul>
        {isLoading && (
          <div className="flex justify-center items-center h-24">
            <div role="status">
              <svg
                aria-hidden="true"
                className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
        {tasks.map(task => (
          <li key={task.id} className='flex items-center mb-2'>
            <span className={`flex-grow ${task.completed ? "line-through text-gray-500" : ""
              }`}>
              {task.content}
            </span>
            <button
              className={`ml-4 px-2 py-1 ${task.completed ? "bg-gray-400 cursor-not-allowed" : "bg-green-500"} text-white rounded`} onClick={() => completeTask(task.id)}
              disabled={task.completed}
            >
              {task.completed ? "Completed" : "Complete"}
            </button>
            <button className="ml-2 px-2 py-1 bg-red-500 text-white rounded" onClick={() => deleteTask(task.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
};

export default TodoList;
