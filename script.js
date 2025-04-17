let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const taskForm = document.getElementById("taskForm");
const todoColumn = document.getElementById("todoColumn");
const inProgressColumn = document.getElementById("inProgressColumn");
const completedColumn = document.getElementById("completedColumn");
const searchInput = document.getElementById("search");
const priorityFilter = document.getElementById("priorityFilter");
const counter = document.getElementById("counter");

const editModal = document.getElementById("editModal");
const editForm = document.getElementById("editForm");
let editingTaskId = null;

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = taskForm.name.value;
  const status = taskForm.status.value;
  const priority = taskForm.priority.value;
  const description = taskForm.description.value;
  const date = new Date().toLocaleDateString("fa-IR");

  const newTask = {
    id: Date.now(),
    name,
    status,
    priority,
    description,
    date,
  };

  tasks.push(newTask);
  saveTasks();
  taskForm.reset();
  renderTasks();
});

searchInput.addEventListener("input", renderTasks);
priorityFilter.addEventListener("change", renderTasks);

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  const searchTerm = searchInput.value.toLowerCase();
  const priority = priorityFilter.value;

  const filteredTasks = tasks.filter(
    (task) =>
      task.name.toLowerCase().includes(searchTerm) &&
      (priority === "" || task.priority === priority)
  );

  const columns = {
    "To Do": [],
    "In Progress": [],
    "Completed": [],
  };

  filteredTasks.forEach((task) => {
    columns[task.status].push(task);
  });

  renderColumn(todoColumn, columns["To Do"], "To Do");
  renderColumn(inProgressColumn, columns["In Progress"], "In Progress");
  renderColumn(completedColumn, columns["Completed"], "Completed");

  counter.textContent = `تعداد کل تسک‌ها: ${filteredTasks.length}`;
}

function renderColumn(container, tasks, status) {
  container.innerHTML = "";

  if (tasks.length === 0) {
    const emptyMessage = document.createElement("div");
    emptyMessage.className = "empty-message";
    emptyMessage.textContent = "تسکی یافت نشد";
    container.appendChild(emptyMessage);
    return;
  }

  tasks.forEach((task) => {
    const taskDiv = document.createElement("div");
    taskDiv.className = "task";

    const infoDiv = document.createElement("div");
    infoDiv.className = "task-info";
    infoDiv.innerHTML = `
      <strong>${task.name}</strong><br/>
      <small>📅 ${task.date} | 🔥 ${task.priority}</small><br/>
      <small>📝 ${task.description}</small>
    `;

    const controlsDiv = document.createElement("div");
    controlsDiv.className = "controls";

    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️";
    editBtn.onclick = () => openEditModal(task.id);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️";
    deleteBtn.onclick = () => deleteTask(task.id);

    controlsDiv.appendChild(editBtn);
    controlsDiv.appendChild(deleteBtn);

    taskDiv.appendChild(infoDiv);
    taskDiv.appendChild(controlsDiv);

    container.appendChild(taskDiv);
  });
}

function deleteTask(id) {
  if (confirm("آیا از حذف این تسک مطمئن هستید؟")) {
    tasks = tasks.filter((task) => task.id !== id);
    saveTasks();
    renderTasks();
  }
}

function openEditModal(id) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;

  editingTaskId = id;
  document.getElementById("editName").value = task.name;
  document.getElementById("editStatus").value = task.status;
  document.getElementById("editPriority").value = task.priority;
  document.getElementById("editDescription").value = task.description;

  editModal.style.display = "block";
}

function closeEditModal() {
  editModal.style.display = "none";
  editingTaskId = null;
}

editForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!editingTaskId) return;

  const task = tasks.find((t) => t.id === editingTaskId);
  if (!task) return;

  task.name = document.getElementById("editName").value;
  task.status = document.getElementById("editStatus").value;
  task.priority = document.getElementById("editPriority").value;
  task.description = document.getElementById("editDescription").value;

  saveTasks();
  renderTasks();
  closeEditModal();
});

window.addEventListener("click", (e) => {
  if (e.target === editModal) closeEditModal();
});

renderTasks();





















