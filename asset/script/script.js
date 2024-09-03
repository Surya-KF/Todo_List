const todoForm = document.querySelector('form');
const todoInput = document.getElementById('todo-input');
const todoDateInput = document.getElementById('todo-date');
const todoTimeInput = document.getElementById('todo-time');
const todoListsDiv = document.getElementById('todo-lists');
const themeToggle = document.getElementById('theme-toggle');
const colorThemeSelect = document.getElementById('color-theme');
const selectAllButton = document.getElementById('select-all-button');
const deleteAllButton = document.getElementById('delete-all-button');

let allTodos = getTodos();
updateTodoList();

todoForm.addEventListener('submit', function(e) {
    e.preventDefault();
    addTodo();
});

themeToggle.addEventListener('click', toggleTheme);
colorThemeSelect.addEventListener('change', changeColorTheme);
selectAllButton.addEventListener('click', selectAllTodos);
deleteAllButton.addEventListener('click', deleteAllTodos);

function addTodo() {
    const todoText = todoInput.value.trim();
    const todoDate = todoDateInput.value || new Date().toISOString().split('T')[0];
    const todoTime = todoTimeInput.value || new Date().toTimeString().split(' ')[0].slice(0, 5);
    if (todoText.length > 0) {
        const todoObject = {
            text: todoText,
            completed: false,
            date: todoDate,
            time: todoTime
        }
        allTodos.push(todoObject);
        updateTodoList();
        saveTodos();
        todoInput.value = "";
    }
}

function updateTodoList() {
    todoListsDiv.innerHTML = "";
    const groupedTodos = groupTodosByDate(allTodos);
    
    for (const [date, todos] of Object.entries(groupedTodos)) {
        const dateSection = document.createElement('div');
        dateSection.className = 'date-section';
        dateSection.innerHTML = `<h2>${formatDate(date)}</h2>`;
        
        const todoListUL = document.createElement('ul');
        todos.forEach((todo, todoIndex) => {
            const todoItem = createTodoItem(todo, todoIndex);
            todoListUL.appendChild(todoItem);
        });
        
        dateSection.appendChild(todoListUL);
        todoListsDiv.appendChild(dateSection);
    }
}

function createTodoItem(todo, todoIndex) {
    const todoId = "todo-"+todoIndex;
    const todoLI = document.createElement("li");
    const todoText = todo.text;
    const todoTime = todo.time ? ` (${todo.time})` : '';
    todoLI.className = "todo";
    todoLI.innerHTML = `<input type="checkbox" id="${todoId}">
                <label class="custom-checkbox" for="${todoId}">
                    <svg fill="transparent" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                        <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>
                </label>
                <label for="${todoId}" class="todo-text">
                ${todoText}${todoTime}
                </label>
                <button class="delete-button">
                    <svg fill="var(--secondary-color)" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                        <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                </button>
                `
    const deleteButton = todoLI.querySelector(".delete-button");
    deleteButton.addEventListener("click", ()=>{
        deleteTodoItem(todoIndex);
    })
    const checkbox = todoLI.querySelector("input");
    checkbox.addEventListener("change", ()=>{
        allTodos[todoIndex].completed = checkbox.checked;
        saveTodos();
    })
    checkbox.checked = todo.completed;
    return todoLI;
}

function deleteTodoItem(todoIndex) {
    allTodos = allTodos.filter((_, i) => i !== todoIndex);
    saveTodos();
    updateTodoList();
}

function saveTodos() {
    const todosJson = JSON.stringify(allTodos);
    localStorage.setItem("todos", todosJson);
}

function getTodos() {
    const todos = localStorage.getItem("todos") || "[]";
    return JSON.parse(todos);
}

function toggleTheme() {
    document.body.classList.toggle('light-theme');
    const icon = themeToggle.querySelector('i');
    if (document.body.classList.contains('light-theme')) {
        icon.classList.replace('fa-sun', 'fa-moon');
    } else {
        icon.classList.replace('fa-moon', 'fa-sun');
    }
}

function changeColorTheme(e) {
    const color = e.target.value;
    document.documentElement.style.setProperty('--accent-color', color);
}

function selectAllTodos() {
    allTodos = allTodos.map(todo => ({...todo, completed: true}));
    saveTodos();
    updateTodoList();
}

function deleteAllTodos() {
    if (confirm("Are you sure you want to delete all todos?")) {
        allTodos = [];
        saveTodos();
        updateTodoList();
    }
}

function groupTodosByDate(todos) {
    return todos.reduce((groups, todo) => {
        const date = todo.date;
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(todo);
        return groups;
    }, {});
}

function formatDate(dateString) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}