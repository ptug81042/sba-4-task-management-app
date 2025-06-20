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