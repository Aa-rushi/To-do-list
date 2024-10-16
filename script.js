document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('taskInput');
  const addTaskButton = document.getElementById('addTaskButton');
  const taskList = document.getElementById('taskList');
  const completedList = document.getElementById('completedList');
  const resetButton = document.getElementById('resetButton');
 
  loadTasks();

  addTaskButton.addEventListener('click', () => {
      const taskValue = taskInput.value.trim();
      if (taskValue) {
          addTask(taskValue);
          taskInput.value = '';
          saveTasks();
      }
  });

  resetButton.addEventListener('click', () => {
      taskList.innerHTML = '';
      completedList.innerHTML = '';
      localStorage.removeItem('tasks');
      localStorage.removeItem('completedTasks');
  });

  function addTask(task) {
      const taskItem = document.createElement('li');
      taskItem.innerHTML = `
          <input type="checkbox" class="checkbox">
          <span>${task}</span>
          <i class="fas fa-edit icon"></i>
          <i class="fas fa-trash icon"></i>
      `;
      
      const checkbox = taskItem.querySelector('.checkbox');
      const editIcon = taskItem.querySelector('.fa-edit');
      const deleteIcon = taskItem.querySelector('.fa-trash');

      checkbox.addEventListener('change', () => {
          if (checkbox.checked) {
              taskItem.classList.add('completed');
              moveToCompleted(taskItem);
          } else {
              taskItem.classList.remove('completed');
              moveToActive(taskItem);
          }
          saveTasks();
      });

      editIcon.addEventListener('click', () => editTask(taskItem));
      deleteIcon.addEventListener('click', () => removeTask(taskItem));

      taskList.appendChild(taskItem);
  }

  function moveToCompleted(taskItem) {
      completedList.appendChild(taskItem);
  }

  function moveToActive(taskItem) {
      taskList.appendChild(taskItem);
  }

  function removeTask(taskItem) {
      taskItem.remove();
      saveTasks();
  }
  function editTask(taskItem) {
      const span = taskItem.querySelector('span');
      const newTask = prompt('Edit task:', span.textContent);
      if (newTask !== null && newTask.trim() !== '') {
          span.textContent = newTask.trim();
          saveTasks();
      }
  }

  function saveTasks() {
      const tasks = [];
      taskList.querySelectorAll('li').forEach(item => {
          tasks.push({
              text: item.querySelector('span').textContent,
              completed: item.querySelector('.checkbox').checked
          });
      });

      const completedTasks = [];
      completedList.querySelectorAll('li').forEach(item => {
          completedTasks.push({
              text: item.querySelector('span').textContent,
              completed: true
          });
      });

      localStorage.setItem('tasks', JSON.stringify(tasks));
      localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
  }

  function loadTasks() {
      const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      const completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];

      tasks.forEach(task => {
          const taskItem = document.createElement('li');
          taskItem.innerHTML = `
              <input type="checkbox" class="checkbox" ${task.completed ? 'checked' : ''}>
              <span>${task.text}</span>
              <i class="fas fa-edit icon"></i>
              <i class="fas fa-trash icon"></i>
          `;

          const checkbox = taskItem.querySelector('.checkbox');
          const editIcon = taskItem.querySelector('.fa-edit');
          const deleteIcon = taskItem.querySelector('.fa-trash');

          checkbox.addEventListener('change', () => {
              if (checkbox.checked) {
                  taskItem.classList.add('completed');
                  moveToCompleted(taskItem);
              } else {
                  taskItem.classList.remove('completed');
                  moveToActive(taskItem);
              }
              saveTasks();
          });

          editIcon.addEventListener('click', () => editTask(taskItem));
          deleteIcon.addEventListener('click', () => removeTask(taskItem));

          if (task.completed) {
              completedList.appendChild(taskItem);
          } else {
              taskList.appendChild(taskItem);
          }
      });
  }
});