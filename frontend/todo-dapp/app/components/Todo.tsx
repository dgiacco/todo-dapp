import React from 'react'

interface TodoProps {
  id: number,
  completed: boolean,
  content: string,
  completeTodo: (id: number) => void,
  deleteTodo: (id: number) => void,
}

const Todo = ({ id, completed, content, completeTodo, deleteTodo }: TodoProps) => {
  return (
    <div className="border p-4 max-w-md shadow-md rounded-md">
      <span className={`flex-grow text-xl ${completed ? "line-through text-gray-500" : ""}`}>
        {content}
      </span>
      <div className="flex space-x-2 mt-4">
        <button
          className={`px-4 py-2 rounded ${completed ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 text-white"} `}
          disabled={completed}
          onClick={() => completeTodo(id)}
        >
          Complete
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded"
          onClick={() => deleteTodo(id)}
        >
          Delete
        </button>
      </div>
    </div>
  )
}

export default Todo