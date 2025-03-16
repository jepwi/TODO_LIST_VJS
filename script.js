document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskButton = document.getElementById('addTaskButton');
    const taskList = document.getElementById('taskList');

    loadTasks();

    addTaskButton.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    function addTask() {
        const taskText = taskInput.value.trim();
        if (!taskText) {
            alert('Task cannot be empty!');
            return;
        }

        const taskItem = createTaskElement(taskText);
        taskList.appendChild(taskItem);
        saveTasks();
        taskInput.value = '';
    }

    function createTaskElement(taskText) {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item d-flex justify-content-between align-items-center fade-in';

        listItem.innerHTML = `
            <span class="task-text">${taskText}</span>
            <div>
                <button class="btn btn-sm edit-button">✏️</button>
                <button class="btn btn-sm done-button">✔️</button>
                <button class="btn btn-sm delete-button">🗑️</button>
            </div>
        `;

        return listItem;
    }

    taskList.addEventListener('click', (e) => {
        const listItem = e.target.closest('li');

        if (e.target.classList.contains('delete-button')) {
            listItem.classList.add('fade-out');
            setTimeout(() => {
                listItem.remove();
                saveTasks();
            }, 300);
        }

        if (e.target.classList.contains('done-button')) {
            listItem.classList.toggle('list-group-item-success');
            saveTasks();
        }

        if (e.target.classList.contains('edit-button')) {
            const taskText = listItem.querySelector('.task-text');
            const newText = prompt('Edit task:', taskText.textContent);
            if (newText?.trim()) {
                taskText.textContent = newText.trim();
                saveTasks();
            }
        }
    });

    function saveTasks() {
        const tasks = Array.from(taskList.children).map(li => ({
            text: li.querySelector('.task-text').textContent,
            completed: li.classList.contains('list-group-item-success')
        }));
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        storedTasks.forEach(task => {
            const taskItem = createTaskElement(task.text);
            if (task.completed) {
                taskItem.classList.add('list-group-item-success');
            }
            taskList.appendChild(taskItem);
        });
    }
});

