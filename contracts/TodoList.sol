// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TodoList {

  struct Task {
    uint id;
    string content;
    bool completed;
  }

  mapping (address => Task[]) private userTasks;

  // Counter to generate unique task IDs
  uint private taskIdCounter;

  event TaskCreated(address indexed user, uint id, string content);
  event TaskCompleted(address indexed user, uint id);
  event TaskDeleted(address indexed user, uint id);

  function createTask(string memory _content) public {
    uint taskId = taskIdCounter++;
    userTasks[msg.sender].push(Task(taskId, _content, false));
    emit TaskCreated(msg.sender, taskId, _content);
  }

  function completeTask(uint _id) public {
    for(uint i = 0; i < userTasks[msg.sender].length; i++) {
      if(userTasks[msg.sender][i].id == _id) {
        // Check if the task is already completed
        require(!userTasks[msg.sender][i].completed, "Task already completed");
        
        userTasks[msg.sender][i].completed = true;
        emit TaskCompleted(msg.sender, _id);
        return;  // Exit the function when the task has been found and updated for efficiency
      }
    }
    // If no task with the given ID is found, revert the transaction
    revert("Task does not exist");
  }

  function deleteTask(uint _id) public {
    for (uint i = 0; i < userTasks[msg.sender].length; i++) {
        if (userTasks[msg.sender][i].id == _id) {
            // Swap the task with the last task in the array and then remove the last element
            userTasks[msg.sender][i] = userTasks[msg.sender][userTasks[msg.sender].length - 1];
            userTasks[msg.sender].pop();
            
            emit TaskDeleted(msg.sender, _id);
            return;
        }
    }

    // If no task with the given ID is found, revert the transaction
    revert("Task does not exist");
}

  function getTasks() public view returns (Task[] memory) {
    return userTasks[msg.sender];
  }
}

