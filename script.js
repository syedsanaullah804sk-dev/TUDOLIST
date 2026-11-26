
const taskInput = document.getElementById("taskInput");
const priority = document.getElementById("priority");
const dueDate = document.getElementById("dueDate");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");

let tasks = JSON.parse(localStorage.getItem("myTasks")) || [];
let currentFilter = "all";

function saveTasks() {
    localStorage.setItem("myTasks", JSON.stringify(tasks));
}

function addTask() {
    const name = taskInput.value.trim();

    if (name === "") {
        alert("Please enter a task!");
        return;
    }

    tasks.push({
        id: Date.now(),
        name: name,
        priority: priority.value,
        date: dueDate.value,
        completed: false
    });

    taskInput.value = "";
    dueDate.value = "";

    saveTasks();
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

function editTask(id) {
    const task = tasks.find(task => task.id === id);

    const newName = prompt("Edit your task:", task.name);

    if (newName !== null && newName.trim() !== "") {
        task.name = newName.trim();
        saveTasks();
        renderTasks();
    }
}

function toggleTask(id) {
    const task = tasks.find(task => task.id === id);

    task.completed = !task.completed;

    saveTasks();
    renderTasks();
}

function renderTasks() {

    taskList.innerHTML = "";

    const search = searchInput.value.toLowerCase();

    let filteredTasks = tasks.filter(task =>
        task.name.toLowerCase().includes(search)
    );

    if (currentFilter === "pending") {
        filteredTasks = filteredTasks.filter(task =>
            !task.completed
        );
    }

    if (currentFilter === "completed") {
        filteredTasks = filteredTasks.filter(task =>
            task.completed
        );
    }

    document.getElementById("emptyMessage").style.display =
        filteredTasks.length === 0 ? "block" : "none";

    filteredTasks.forEach(task => {

        const item = document.createElement("div");

        item.className = "task-item";

        if (task.completed) {
            item.classList.add("completed");
        }

        const left = document.createElement("div");
        left.className = "task-left";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.addEventListener("change", () => toggleTask(task.id));

        const info = document.createElement("div");

        const name = document.createElement("div");
        name.className = "task-name";
        name.textContent = task.name;

        const badge = document.createElement("span");
        badge.className = "priority " + task.priority;
        badge.textContent = task.priority;

        name.appendChild(badge);

        const details = document.createElement("div");
        details.className = "task-details";
        details.textContent = task.date
            ? "Due: " + task.date
            : "No due date";

        info.appendChild(name);
        info.appendChild(details);

        left.appendChild(checkbox);
        left.appendChild(info);

        const actions = document.createElement("div");
        actions.className = "actions";

        const editBtn = document.createElement("button");
        editBtn.textContent = "✎ Edit";
        editBtn.addEventListener("click", () => editTask(task.id));

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "✕ Delete";
        deleteBtn.className = "delete";
        deleteBtn.addEventListener("click", () => deleteTask(task.id));

        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);

        item.appendChild(left);
        item.appendChild(actions);

        taskList.appendChild(item);

    });

    updateStats();
}

function updateStats() {

    const total = tasks.length;

    const completed = tasks.filter(task =>
        task.completed
    ).length;

    const pending = total - completed;

    const percentage = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    document.getElementById("totalTasks").textContent = total;

    document.getElementById("completedTasks").textContent = completed;

    document.getElementById("pendingTasks").textContent = pending;

    document.getElementById("progressText").textContent =
        percentage + "%";

    document.getElementById("progressFill").style.width =
        percentage + "%";
}

// Add Task

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});

// Search Tasks

searchInput.addEventListener("input", renderTasks);

// Filter Tasks

document.querySelectorAll(".filter").forEach(button => {

    button.addEventListener("click", function() {

        document.querySelectorAll(".filter").forEach(btn =>
            btn.classList.remove("active")
        );

        this.classList.add("active");

        currentFilter = this.dataset.filter;

        renderTasks();

    });

});

// Light and Dark Theme

document.getElementById("themeBtn").addEventListener("click", function() {

    document.body.classList.toggle("light");

    this.textContent = document.body.classList.contains("light")
        ? "☾ Dark"
        : "☀ Theme";

});

// Display Saved Tasks

renderTasks();
