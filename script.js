document.addEventListener('DOMContentLoaded', () => {
    loadTodos();
    updateTime();
    setInterval(updateTime, 1000);
    checkOverdueTasks();
    setInterval(checkOverdueTasks, 60000);
});

document.getElementById('add-todo').addEventListener('click', addTodo);
document.getElementById('delete-all').addEventListener('click', deleteAllTodos);

function updateTime() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('current-time').textContent = "Time     : " + now.toLocaleDateString(undefined, options);
}

function addTodo() {
    const todoInput = document.getElementById('todo-input');
    const priorityLevel = document.getElementById('priority-level').value;
    const deadline = document.getElementById('deadline').value;
    const todoText = todoInput.value.trim();

    if (todoText === '' || deadline === '') return;

    const todoItem = document.createElement('tr');
    todoItem.innerHTML = `
        <td><input type="checkbox" onclick="toggleDone(this)"></td>
        <td>${todoText}</td>
        <td>${priorityLevel}</td>
        <td>${deadline}</td>
        <td class="todo-actions"><button onclick="editTodoItem(this)">Edit</button></td>
    `;
    document.getElementById('todo-list').appendChild(todoItem);

    saveTodos();
    todoInput.value = '';
    document.getElementById('deadline').value = '';
}

function toggleDone(checkbox) {
    const todoItem = checkbox.parentElement.parentElement;
    const doneList = document.getElementById('done-list');

    if (checkbox.checked) {
        const doneItem = document.createElement('li');
        doneItem.innerHTML = `
            <span>${todoItem.children[1].textContent}</span>
            <button class="removeDone" onclick="removeDoneItem(this)">&#10006;</button>
        `;
        doneItem.classList.add('done');
        doneList.appendChild(doneItem);
        todoItem.remove();
        saveTodos();
    }
}

function editTodoItem(button) {
    const todoItem = button.parentElement.parentElement;
    const todoText = todoItem.children[1].textContent;
    const priorityLevel = todoItem.children[2].textContent;
    const deadline = todoItem.children[3].textContent;

    document.getElementById('todo-input').value = todoText;
    document.getElementById('priority-level').value = priorityLevel;
    document.getElementById('deadline').value = deadline;

    todoItem.remove();
    saveTodos();
}

function removeDoneItem(button) {
    button.parentElement.remove();
    saveTodos();
}

function deleteAllTodos() {
    document.getElementById('todo-list').innerHTML = '';
    document.getElementById('done-list').innerHTML = '';
    document.getElementById('overdue-list').innerHTML = '';
    saveTodos();
}

function checkOverdueTasks() {
    const todoList = document.getElementById('todo-list').children;
    const overdueList = document.getElementById('overdue-list');
    const now = new Date();

    for (let i = 0; i < todoList.length; i++) {
        const deadline = new Date(todoList[i].children[3].textContent);
        if (deadline < now) {
            const overdueItem = document.createElement('li');
            overdueItem.innerHTML = `
                <span>${todoList[i].children[1].textContent}</span>
                <button class="removeOverdue" onclick="removeOverdueItem(this)">&#10006;</button>
            `;
            overdueItem.classList.add('overdue');
            overdueList.appendChild(overdueItem);
            todoList[i].remove();
            saveTodos();
        }
    }
}

function removeOverdueItem(button) {
    button.parentElement.remove();
    saveTodos();
}

function saveTodos() {
    const todos = [];
    const todoList = document.getElementById('todo-list').children;
    const doneList = document.getElementById('done-list').children;
    const overdueList = document.getElementById('overdue-list').children;

    for (let i = 0; i < todoList.length; i++) {
        const todo = {
            text: todoList[i].children[1].textContent,
            priority: todoList[i].children[2].textContent,
            deadline: todoList[i].children[3].textContent,
            done: false,
            overdue: false
        };
        todos.push(todo);
    }

    for (let i = 0; i < doneList.length; i++) {
        const doneTodo = {
            text: doneList[i].children[0].textContent,
            priority: '',
            deadline: '',
            done: true,
            overdue: false
        };
        todos.push(doneTodo);
    }

    for (let i = 0; i < overdueList.length; i++) {
        const overdueTodo = {
            text: overdueList[i].children[0].textContent,
            priority: '',
            deadline: '',
            done: false,
            overdue: true
        };
        todos.push(overdueTodo);
    }

    localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTodos() {
    const todos = JSON.parse(localStorage.getItem('todos') || '[]');

    for (const todo of todos) {
        if (!todo.done && !todo.overdue) {
            const todoItem = document.createElement('tr');
            todoItem.innerHTML = `
                <td><input type="checkbox" onclick="toggleDone(this)"></td>
                <td>${todo.text}</td>
                <td>${todo.priority}</td>
                <td>${todo.deadline}</td>
                <td><button onclick="editTodoItem(this)">Edit</button></td>
            `;
            document.getElementById('todo-list').appendChild(todoItem);
        } else if (todo.done) {
            const doneItem = document.createElement('li');
            doneItem.innerHTML = `
                <span>${todo.text}</span>
                <button class="removeDone" onclick="removeDoneItem(this)">&#10006;</button>
            `;
            doneItem.classList.add('done');
            document.getElementById('done-list').appendChild(doneItem);
        } else if (todo.overdue) {
            const overdueItem = document.createElement('li');
            overdueItem.innerHTML = `
                <span>${todo.text}</span>
                <button class="removeOverdue" onclick="removeOverdueItem(this)">&#10006;</button>
            `;
            overdueItem.classList.add('overdue');
            document.getElementById('overdue-list').appendChild(overdueItem);
        }
    }
}
