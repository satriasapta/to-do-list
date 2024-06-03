document.addEventListener('DOMContentLoaded', () => {
    updateTime();
    setInterval(updateTime, 1000);
    checkOverdueTasks();
    setInterval(checkOverdueTasks, 6000); // Check mengecek telat atau tidaknya tugas setiap 1 menit
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
    `;
    document.getElementById('todo-list').appendChild(todoItem);

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
    }
}

function removeDoneItem(button) {
    button.parentElement.remove();
}

function deleteAllTodos() {
    document.getElementById('todo-list').innerHTML = '';
    document.getElementById('done-list').innerHTML = '';
    document.getElementById('overdue-list').innerHTML = '';
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
            i--; // Adjust index after removal
        }
    }
}

function removeOverdueItem(button) {
    button.parentElement.remove();
}
