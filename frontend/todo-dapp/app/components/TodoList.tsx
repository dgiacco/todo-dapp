"use client"

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { contractAddress, contractABI } from '../utils/contractInfo'

const TodoList = () => {
  const [tasks, setTasks] = useState<{ id: number; content: string; completed: boolean }[]>([])
  const [newTask, setNewTask] = useState('')
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        setProvider(provider);
        setContract(contract);

        await fetchTasks(); // Fetch tasks after initializing contract
      } else {
        console.error("Ethereum provider not found");
      }
    };
    init();
  }, []);

  const fetchTasks = async () => {
    if (contract) {
      try {
        const tasks = await contract.getTasks();
        console.log("Fetched tasks:", tasks);
        setTasks(tasks.map((task: any) => ({
          id: task.id,
          content: task.content,
          completed: task.completed,
        })));
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    }
  }

  const loadTasks = async (contract: ethers.Contract) => {
    try {
      const tasks = await contract.getTasks();
      setTasks(tasks.map((task: any) => ({
        id: task.id,
        content: task.content,
        completed: task.completed
      })));
    } catch (error) {
      console.error("Error loading tasks: ", error);
    }
  }

  const createTask = async () => {
    if (!contract) {
      console.error("Contract not initialized");
      return;
    }

    try {
      const tx = await contract.createTask(newTask);
      await tx.wait(); // Wait for the transaction to be mined
      setNewTask(''); // Clear input field
      await loadTasks(contract); // Refresh the task list
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

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
        {tasks.map(task => (
          <li key={task.id} className='flex items-center mb-2'>
            <span className={`flex-grow ${task.completed ? "line-through text-gray-500" : ""
              }`}>
              {task.content}
            </span>
            <button className="ml-4 px-2 py-1 bg-green-500 text-white rounded">
              Complete
            </button>
            <button className="ml-2 px-2 py-1 bg-red-500 text-white rounded">
              Delete
            </button>
          </li>
        ))}
      </ul>
      <button
        onClick={fetchTasks}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Load Tasks
      </button>
    </div>
  )
};

export default TodoList;
