const apiURL = "https://67e1336258cc6bf78524c33e.mockapi.io/SAHAR";
const form = document.getElementById("taskForm");
const searchInput = document.getElementById("search");
const priorityFilter = document.getElementById("priorityFilter");
const todoColumn = document.getElementById("todoColumn");
const inProgressColumn = document.getElementById("inProgressColumn");
const completedColumn = document.getElementById("completedColumn");
const counter = document.getElementById("counter");

let tasks = [];
let currentEditTaskId = null;

async function fetchTasks() {
  const res = await fetch(apiURL);
  return await res.json();
}

function renderTasks(filteredTasks) {
  todoColumn.innerHTML = "";
  inProgressColumn.innerHTML = "";
  completedColumn.innerHTML = "";

  const todos = filteredTasks.filter(t => t.status === "To Do");
  const inProgress = filteredTasks.filter(t => t.status === "In Progress");
  const completed = filteredTasks.filter(t => t.status === "Completed");

  counter.textContent = `تعداد کل تسک‌ها: ${filteredTasks.length}`;

  function renderColumn(tasksList, column) {
    if (tasksList.length === 0) {
      column.innerHTML = `<p class="empty-message">تسکی یافت نشد ❗</p>`;
      return;
    }
    tasksList.forEach(task => {
      const div = document.createElement("div");
      div.className = "task";
      div.innerHTML = `
        <div class="task-info">
          <strong>${task.name}</strong><br />
          <small>وضعیت: ${task.status} | اولویت: ${task.priority}</small><br />
          <small>تاریخ: ${new Date(task.createdAt).toLocaleString("fa-IR")}</small><br />
          <small>توضیحات: ${task.description}</small>
        </div>
        <div class="controls">
          <button onclick="deleteTask('${task.id}')">🗑</button>
          <button onclick="openEditModal('${task.id}')">✏️</button>
        </div>
      `;
      column.appendChild(div);
    });
  }

  renderColumn(todos, todoColumn);
  renderColumn(inProgress, inProgressColumn);
  renderColumn(completed, completedColumn);
}

async function deleteTask(id) {
  await fetch(`${apiURL}/${id}`, { method: "DELETE" });
  loadTasks();
}

function openEditModal(id) {
  currentEditTaskId = id;
  const task = tasks.find(t => t.id === id);
  document.getElementById("editName").value = task.name;
  document.getElementById("editStatus").value = task.status;
  document.getElementById("editPriority").value = task.priority;
  document.getElementById("editDescription").value = task.description;
  document.getElementById("editModal").style.display = "block";
}

function closeEditModal() {
  document.getElementById("editModal").style.display = "none";
  currentEditTaskId = null;
}

document.getElementById("editForm").addEventListener("submit", async e => {
  e.preventDefault();
  const updatedTask = {
    name: document.getElementById("editName").value.trim(),
    status: document.getElementById("editStatus").value,
    priority: document.getElementById("editPriority").value,
    description: document.getElementById("editDescription").value.trim(),
    createdAt: new Date().toISOString(),
  };
  await fetch(`${apiURL}/${currentEditTaskId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedTask)
  });
  closeEditModal();
  loadTasks();
});

form.addEventListener("submit", async e => {
  e.preventDefault();
  const newTask = {
    name: form.name.value.trim(),
    status: form.status.value,
    priority: form.priority.value,
    description: form.description.value.trim(),
    createdAt: new Date().toISOString()
  };
  await fetch(apiURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newTask)
  });
  form.reset();
  loadTasks();
});

searchInput.addEventListener("input", loadTasks);
priorityFilter.addEventListener("change", loadTasks);

async function loadTasks() {
  tasks = await fetchTasks();
  let filtered = tasks;

  const searchTerm = searchInput.value.trim().toLowerCase();
  const priority = priorityFilter.value;

  if (searchTerm) {
    filtered = filtered.filter(t =>
      t.name.toLowerCase().includes(searchTerm)
    );
  }

  if (priority) {
    filtered = filtered.filter(t => t.priority === priority);
  }

  renderTasks(filtered);
}

loadTasks();





















