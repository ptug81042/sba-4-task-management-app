// Array to store tasks
let tasks = [];

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

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
    const stored = localStorage.getItem('tasks');
    if (stored) {
        try {
            tasks = JSON.parse(stored);
        } catch {
            tasks = [];
        }
    }
}

// Function to add or update a task
function addOrUpdateTask(taskName, category, deadline, status, editIndex = null) {
    const formattedDeadline = formatDate(deadline); // Format deadline before adding
    if (editIndex !== null && editIndex !== "") {
        // Update existing task
        tasks[editIndex] = {
            name: taskName,
            category: category,
            deadline: formattedDeadline,
            status: status
        };
    } else {
        // Add new task
        const task = {
            name: taskName,
            category: category,
            deadline: formattedDeadline,
            status: status
        };
        tasks.push(task);
    }
    saveTasks();
}

// Function to check and update overdue tasks
function updateOverdueTasks() {
    const today = new Date();
    let changed = false;
    tasks.forEach(task => {
        // Only update if not already Completed or Cancelled
        if (
            task.status !== "Completed" &&
            task.status !== "Cancelled" &&
            task.deadline &&
            new Date(task.deadline) < today
        ) {
            if (task.status !== "Overdue") {
                task.status = "Overdue";
                changed = true;
            }
        }
    });
    if (changed) saveTasks();
}

// Populate category filter dropdown with unique categories
function updateCategoryFilter() {
    const filterCategory = document.getElementById('filter-category');
    if (!filterCategory) return;
    // Get unique categories
    const categories = Array.from(new Set(tasks.map(task => task.category)));
    // Save current selection
    const current = filterCategory.value;
    // Clear and add "All"
    filterCategory.innerHTML = '<option value="">All</option>';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        filterCategory.appendChild(option);
    });
    // Restore selection if possible
    filterCategory.value = current;
}

// Function to render the task list in the table with filtering
function renderTasks() {
    updateOverdueTasks(); // Check deadlines before rendering
    updateCategoryFilter(); // Update category filter options

    const filterCategory = document.getElementById('filter-category') ? document.getElementById('filter-category').value : '';
    const filterStatus = document.getElementById('filter-status') ? document.getElementById('filter-status').value : '';

    const tbody = document.getElementById('task-table-body');
    tbody.innerHTML = '';
    tasks.forEach((task, index) => {
        // Apply filters
        if (
            (filterCategory && task.category !== filterCategory) ||
            (filterStatus && task.status !== filterStatus)
        ) {
            return;
        }
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${task.name}</td>
            <td>${task.category}</td>
            <td>${task.deadline}</td>
            <td>
                <select data-index="${index}" class="status-select form-select form-select-sm">
                    <option value="In Progress" ${task.status === "In Progress" ? "selected" : ""}>In Progress</option>
                    <option value="Completed" ${task.status === "Completed" ? "selected" : ""}>Completed</option>
                    <option value="Pending" ${task.status === "Pending" ? "selected" : ""}>Pending</option>
                    <option value="Overdue" ${task.status === "Overdue" ? "selected" : ""}>Overdue</option>
                    <option value="On Hold" ${task.status === "On Hold" ? "selected" : ""}>On Hold</option>
                    <option value="Cancelled" ${task.status === "Cancelled" ? "selected" : ""}>Cancelled</option>
                </select>
            </td>
            <td>
                <button class="btn btn-warning btn-sm edit-task me-1" data-index="${index}">Edit</button>
                <button class="btn btn-danger btn-sm delete-task" data-index="${index}">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    })
}

// Listen for filter changes
document.addEventListener('DOMContentLoaded', function() {
    loadTasks();
    renderTasks();
    const filterCategory = document.getElementById('filter-category');
    const filterStatus = document.getElementById('filter-status');
    if (filterCategory) filterCategory.addEventListener('change', renderTasks);
    if (filterStatus) filterStatus.addEventListener('change', renderTasks);
});

// Handle form submission to add or update a task
document.getElementById('task-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const taskName = document.getElementById('task-name').value;
    const category = document.getElementById('category').value;
    const deadline = document.getElementById('deadline').value;
    const status = document.getElementById('status').value;
    const editIndex = document.getElementById('edit-index').value;

    addOrUpdateTask(taskName, category, deadline, status, editIndex !== "" ? Number(editIndex) : null);
    renderTasks();
    this.reset();
    document.getElementById('edit-index').value = "";
    document.getElementById('submit-btn').textContent = "Add Task";
    document.getElementById('cancel-edit-btn').classList.add('d-none');
});

// Handle status change in the table
document.getElementById('task-table-body').addEventListener('change', function(e) {
    if (e.target.classList.contains('status-select')) {
        const index = e.target.getAttribute('data-index');
        tasks[index].status = e.target.value;
        saveTasks();
        renderTasks();
    }
});

// Handle delete and edit button click
document.getElementById('task-table-body').addEventListener('click', function(e) {
    const index = e.target.getAttribute('data-index');
    if (e.target.classList.contains('delete-task')) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    }
    if (e.target.classList.contains('edit-task')) {
        const task = tasks[index];
        document.getElementById('task-name').value = task.name;
        document.getElementById('category').value = task.category;
        document.getElementById('deadline').value = task.deadline;
        document.getElementById('status').value = task.status;
        document.getElementById('edit-index').value = index;
        document.getElementById('submit-btn').textContent = "Update Task";
        document.getElementById('cancel-edit-btn').classList.remove('d-none');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

// Handle cancel edit
document.getElementById('cancel-edit-btn').addEventListener('click', function() {
    document.getElementById('task-form').reset();
    document.getElementById('edit-index').value = "";
    document.getElementById('submit-btn').textContent = "Add Task";
    this.classList.add('d-none');
});

// Initial render
renderTasks();