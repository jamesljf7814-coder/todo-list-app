// Load todos from localStorage
function loadTodos() {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
}

// Save todos to localStorage
function saveTodos(todos) {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Render todos on the page
function renderTodos() {
    const todoList = document.getElementById('todoList');
    const todos = loadTodos();

    if (todos.length === 0) {
        todoList.innerHTML = '<li class="empty-state">No todos yet. Add one to get started!</li>';
        return;
    }

    todoList.innerHTML = todos.map((todo, index) => `
        <li class="todo-item ${todo.completed ? 'completed' : ''}">
            <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''} data-index="${index}">
            <span class="todo-text">${escapeHtml(todo.text)}</span>
            <button class="delete-btn" data-index="${index}">Delete</button>
        </li>
    `).join('');

    // Add event listeners
    document.querySelectorAll('.todo-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => toggleComplete(e.target.dataset.index));
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => deleteTodo(e.target.dataset.index));
    });
}

// Add a new todo
function addTodo() {
    const input = document.getElementById('todoInput');
    const text = input.value.trim();

    if (!text) {
        alert('Please enter a task!');
        return;
    }

    const todos = loadTodos();
    todos.push({ text, completed: false });
    saveTodos(todos);
    input.value = '';
    renderTodos();
}

// Toggle todo completion status
function toggleComplete(index) {
    const todos = loadTodos();
    todos[index].completed = !todos[index].completed;
    saveTodos(todos);
    renderTodos();
}

// Delete a todo
function deleteTodo(index) {
    if (!confirm('Are you sure?')) return;
    
    const todos = loadTodos();
    todos.splice(index, 1);
    saveTodos(todos);
    renderTodos();
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderTodos();
    document.getElementById('addBtn').addEventListener('click', addTodo);
    document.getElementById('todoInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo();
    });
});
