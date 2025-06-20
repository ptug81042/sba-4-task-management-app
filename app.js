// Array to store tasks
const tasks = [];

// Function to add a new task
function addTask(taskName, category, deadline, status) {
    const task = {
        name: taskName,
        category: category,
        deadline: deadline,
        status: status
    };
    tasks.push(task);
    return task;
}

// Function to render the task list in the table
function renderTasks() {
    const tbody = document.getElementById('task-table-body');
    tbody.innerHTML = '';
    tasks.forEach((task, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${task.name}</td>
            <td>${task.category}</td>
            <td>${task.deadline}</td>
            <td>
                <select data-index="${index}" class="status-select">
                    <option value="In Progress" ${task.status === "In Progress" ? "selected" : ""}>In Progress</option>
                    <option value="Completed" ${task.status === "Completed" ? "selected" : ""}>Completed</Option>
                    <option value="Pending" ${task.status === "Pending" ? "selected" : ""}>Pending</option>
                    <option value="Overdue" ${task.status === "Overdue" ? "selected" : ""}>Overdue</option>
                    <option value="On Hold" ${task.status === "On Hold" ? "selected" : ""}>On Hold</option>
                    <option value="Cancelled" ${task.status === "Cancelled" ? "selected" : ""}>Cancelled</option>
                </select>
            </td>
        `;
        tbody.appendChild(row);
    })
}

// Handle form submission to add a new task
document.getElementById('task-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const taskName = document.getElementById('task-name').value;
    const category = document.getElementById('category').value;
    const deadline = document.getElementById('deadline').value;
    const status = document.getElementById('status').value;

    addTask(taskName, category, deadline, status);
    renderTasks();
    this.reset();
});

// Handle status change in the table
document.getElementById('task-table-body').addEventListener('change', function(e) {
    if (e.target.classList.contains('status-select')) {
        const index = e.target.getAttribute('data-index');
        tasks[index].status = e.target.value;
        renderTasks();
    }
});

// Initial render
renderTasks();