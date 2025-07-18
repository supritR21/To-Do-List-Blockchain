pragma solidity ^0.5.0;

contract TodoList {
  uint public taskCount = 0;

  struct Task {
    uint id;
    string content;
    bool completed;
  }

  mapping(uint => Task) public tasks;

  // ✅ Define Events
  event TaskCreated(uint id, string content, bool completed);
  event TaskToggled(uint id, bool completed);

  constructor() public {
    createTask("Check out Forbes.com");
  }

  function createTask(string memory _content) public {
    taskCount++;
    tasks[taskCount] = Task(taskCount, _content, false);

    // ✅ Emit event
    emit TaskCreated(taskCount, _content, false);
  }

  function toggleCompleted(uint _id) public {
    Task memory _task = tasks[_id];
    _task.completed = !_task.completed;
    tasks[_id] = _task;

    // ✅ Emit event
    emit TaskToggled(_id, _task.completed);
  }
}
