document.addEventListener('DOMContentLoaded', () => {
    const taskList = document.getElementById('taskList');
    const taskForm = document.getElementById('taskForm');
    const taskDescription = document.getElementById('taskDescription');
  
    // Function to create a new task list item
    function createTaskListItem(task) {
        const li = document.createElement('li');
        li.textContent = task.description;
        li.setAttribute('data-task-id', task.id);
    
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => updateTaskStatus(task.id, checkbox.checked));
    
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', (event) => {
          event.stopPropagation();
          deleteTask(task.id);
        });
    
        li.appendChild(checkbox);
        li.appendChild(deleteButton);
    
        if (task.completed) {
          li.classList.add('completed');
        }
    
        return li;
      }
  
    // Function to fetch tasks from the server
    function fetchTasks() {
      fetch('/api/tasks')
        .then((response) => response.json())
        .then((data) => {
          taskList.innerHTML = '';
          data.forEach((task) => {
            const li = createTaskListItem(task);
            taskList.appendChild(li);
          });
        });
    }
  
    // Function to add a new task
    function addTask(description) {
      fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ description })
      })
      .then((response) => response.json())
      .then((task) => {
        const li = createTaskListItem(task);
        taskList.appendChild(li);
      });
    }
  
    // Function to update task status (completed or not)
    function updateTaskStatus(id, completed) {
      fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ completed })
      })
      .then((response) => response.json())
      .then((task) => {
        const li = createTaskListItem(task);
        const existingLi = taskList.querySelector(`[data-task-id="${id}"]`);
        taskList.replaceChild(li, existingLi);
      });
    }
  
    // Function to delete a task
    function deleteTask(id) {
        fetch(`/api/tasks/${id}`, {
          method: 'DELETE'
        })
        .then((response) => response.json())
        .then(() => {
          const existingLi = taskList.querySelector(`[data-task-id="${id}"]`);
          if (existingLi) {
            taskList.removeChild(existingLi);
          }
        });
      }
  
    // Handle form submission
    taskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const description = taskDescription.value.trim();
      if (description) {
        addTask(description);
        taskDescription.value = '';
      }
    });
  
    // Initial fetch of tasks from the server
    fetchTasks();
  });
  