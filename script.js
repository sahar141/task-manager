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
  counter.textContent = `تعداد تسک‌ها: ${filteredTasks.length}`;

  if (filteredTasks.length === 0) {
    todoColumn.innerHTML = `<p class="empty-message">هنوز هیچ تسکی ثبت نشده ☁️</p>`;
    inProgressColumn.innerHTML = `<p class="empty-message">هنوز هیچ تسکی ثبت نشده ☁️</p>`;
    completedColumn.innerHTML = `<p class="empty-message">هنوز هیچ تسکی ثبت نشده ☁️</p>`;
    return;
  }

  filteredTasks.forEach(task => {
    const div = document.createElement("div");
    div.className = "task";
    div.innerHTML = `
      <div class="task-info">
        <strong>${task.name}</strong><br />
        <small>وضعیت: ${task.status} | اولویت: ${task.priority}</small><br />
        <small>تاریخ: ${new Date(task.createdAt).toLocaleString("fa-IR")}</small><br />
        <small>توضیحات: ${task.description || 'ندارد'}</small>
      </div>
      <div class="controls">
        <button onclick="editTask('${task.id}')">ویرایش</button>
        <button onclick="deleteTask('${task.id}')">حذف</button>
      </div>
    `;

    if (task.status === "To Do") {
      todoColumn.appendChild(div);
    } else if (task.status === "In Progress") {
      inProgressColumn.appendChild(div);
    } else if (task.status === "Completed") {
      completedColumn.appendChild(div);
    }
  });
}

async function loadTasks() {
  tasks = await fetchTasks();
  renderTasks(tasks);
}

function filterTasks() {
  const searchText = searchInput.value.toLowerCase();
  const priority = priorityFilter.value;

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.name.toLowerCase().includes(searchText) || task.description.toLowerCase().includes(searchText);
    const matchesPriority = !priority || task.priority === priority;
    return matchesSearch && matchesPriority;
  });

  renderTasks(filteredTasks);
}

async function deleteTask(id) {
  await fetch(`${apiURL}/${id}`, {
    method: "DELETE",
  });
  tasks = tasks.filter(task => task.id !== id);
  renderTasks(tasks);
}

function editTask(id) {
  const task = tasks.find(t => t.id === id);
  currentEditTaskId = id;
  document.getElementById("editName").value = task.name;
  document.getElementById("editStatus").value = task.status;
  document.getElementById("editPriority").value = task.priority;
  document.getElementById("editDescription").value = task.description;
  document.getElementById("editModal").style.display = "block";
}

function closeEditModal() {
  document.getElementById("editModal").style.display = "none";
}

document.getElementById("editForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const updatedTask = {
    name: document.getElementById("editName").value,
    status: document.getElementById("editStatus").value,
    priority: document.getElementById("editPriority").value,
    description: document.getElementById("editDescription").value,
  };

  await fetch(`${apiURL}/${currentEditTaskId}`, {
    method: "PUT",
    body: JSON.stringify(updatedTask),
    headers: {
      "Content-Type": "application/json",
    },
  });

  tasks = tasks.map(task => (task.id === currentEditTaskId ? { ...task, ...updatedTask } : task));
  renderTasks(tasks);
  closeEditModal();
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const newTask = {
    name: form.name.value,
    status: form.status.value,
    priority: form.priority.value,
    description: form.description.value,
    createdAt: new Date().toISOString(),
  };

  const res = await fetch(apiURL, {
    method: "POST",
    body: JSON.stringify(newTask),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const createdTask = await res.json();

  tasks.push(createdTask);
  renderTasks(tasks);
  form.reset();
});

searchInput.addEventListener("input", filterTasks);
priorityFilter.addEventListener("change", filterTasks);

loadTasks();





















