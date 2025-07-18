App = {
  loading: false,
  contracts: {},

  load: async () => {
    await App.loadWeb3();
    await App.loadAccount();
    await App.loadContract();
    await App.render();
  },

  loadWeb3: async () => {
    if (typeof window.ethereum !== 'undefined') {
      App.web3Provider = window.ethereum;
      window.web3 = new Web3(window.ethereum);
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length === 0) {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
        }
      } catch (error) {
        alert("Please allow MetaMask connection.");
        console.error(error);
      }
    } else {
      alert("MetaMask not detected. Please install MetaMask.");
    }
  },

  loadAccount: async () => {
    const accounts = await web3.eth.getAccounts();
    App.account = accounts[0] || 'Not connected';
    document.getElementById('account').innerText = App.account;
    console.log("Current account:", App.account);
  },

  loadContract: async () => {
    try {
      const todoList = await $.getJSON('../build/contracts/TodoList.json');
      App.contracts.TodoList = TruffleContract(todoList);
      App.contracts.TodoList.setProvider(App.web3Provider);
      App.todoList = await App.contracts.TodoList.deployed();
    } catch (err) {
      alert("Smart contract not found. Did you run `truffle migrate`?");
      console.error(err);
    }
  },

  render: async () => {
    if (App.loading) return;
    App.setLoading(true);

    // Render account
    document.getElementById('account').innerText = App.account;

    // Render tasks
    await App.renderTasks();

    App.setLoading(false);
  },

  renderTasks: async () => {
    const taskCount = await App.todoList.taskCount();
    const $taskList = $('#taskList');
    $taskList.empty();

    for (let i = 1; i <= taskCount; i++) {
      const task = await App.todoList.tasks(i);
      const taskId = task.id.toNumber();
      const taskContent = task.content;
      const taskCompleted = task.completed;

      const $newTask = $(`
        <li class="list-group-item">
          <input type="checkbox" class="float-left mr-2" ${taskCompleted ? 'checked' : ''} data-id="${taskId}" />
          ${taskContent}
        </li>
      `);

      $newTask.find('input').on('click', App.toggleCompleted);
      $taskList.append($newTask);
    }
  },

  createTask: async () => {
    const content = document.getElementById('newTask').value;
    if (!content.trim()) {
      alert("Please enter a task");
      return;
    }
    App.setLoading(true);
    await App.todoList.createTask(content, { from: App.account });
    document.getElementById('newTask').value = '';
    await App.render(); // Refresh UI instead of reloading page
  },

  toggleCompleted: async (e) => {
    const taskId = $(e.target).data('id');
    await App.todoList.toggleCompleted(taskId, { from: App.account });
    await App.render(); // Refresh instead of full reload
  },

  setLoading: (bool) => {
    App.loading = bool;
    const loader = $('#loader');
    const content = $('#content');
    if (bool) {
      loader.show();
      content.hide();
    } else {
      loader.hide();
      content.show();
    }
  }
};

$(() => {
  $(window).on('load', App.load);
});
