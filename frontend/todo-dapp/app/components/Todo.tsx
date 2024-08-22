import { FaTrashAlt } from "react-icons/fa"
import { FaCheck } from "react-icons/fa"

import '../styles/todo.css'

interface TodoProps {
  id: number,
  completed: boolean,
  content: string,
  completeTodo: (id: number) => void,
  deleteTodo: (id: number) => void,
}

const Todo = ({ id, completed, content, completeTodo, deleteTodo }: TodoProps) => {
  return (
    <div className="todo-container">
      <span className={`todo-content text-xl ${completed ? "line-through text-gray-400" : ""}`}>
        {content}
      </span>
      <div className="button-container">
        {!completed &&
          <button
            className="button complete-button"
            disabled={completed}
            onClick={() => completeTodo(id)}
          >
            <FaCheck />
          </button>
        }
        <button
          className="button delete-button"
          onClick={() => deleteTodo(id)}
        >
          <FaTrashAlt />
        </button>
      </div>
    </div>
  )
}

export default Todo