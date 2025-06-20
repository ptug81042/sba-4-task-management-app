// Array to store tasks
const tasks = [];

// Helper function to format date as YYYY-MM-DD
function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date)) return dateStr;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}


// Function to add a new task
function addTask(taskName, category, deadline, status) {
    const formattedDeadline = formatDate(deadline); // Format deadline before adding
    const task = {
        name: taskName,
        category: category,
        deadline: formattedDeadline,
        status: status
    };
    tasks.push(task);
    return task;
}

// Function to check and update overdue tasks
function updateOverdueTasks() {
    const today = new Date();
    tasks.forEach(task => {
        // Only update if not already Completed or Cancelled
        if (
            task.status !== "Completed" && 
            task.status !== "Cancelled" && 
            task.deadline && 
            new Date(task.deadline) < today
        ) {
            task.status = "Overdue";
        }
    });
}

// Function to render the task list in the table
function renderTasks() {
    updateOverdueTasks(); // Check deadlines before rendering
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