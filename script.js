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

// دریافت تسک‌ها
async function fetchTasks() {
  const res = await fetch(apiURL);
  return await res.json();
}

// نمایش تسک‌ها در ستون‌ها
function renderTasks(filteredTasks) {
  todoColumn.innerHTML = "";
  inProgressColumn.innerHTML = "";
  completedColumn.innerHTML = "";
  counter.textContent = `تعداد تسک‌ها: ${filteredTasks.length}`;

  let todoFound = false;
  let inProgressFound = false;
  let completedFound = false;

  filteredTasks.forEach(task => {
    const div = document.createElement("div");
    div.className = "task";
    div.innerHTML = `
      <div class="task-info">
        <strong style="font-size: 14px;">${task.name}</strong><br />
        <small style="font-size: 12px;">وضعیت: ${task.status} | اولویت: ${task.priority}</small><br />
        <small style="font-size: 12px;">تاریخ: ${new Date(task.createdAt).toLocaleString("fa-IR")}</small><br />
        <small style="font-size: 12px;">توضیحات: ${task.description || 'ندارد'}</small>
      </div>
      <div class="controls">
        <button onclick="deleteTask('${task.id}')">🗑 حذف</button>
        <button onclick="openEditModal('${task.id}')">✏️ ویرایش</button>
      </div>
    `;

    if (task.status === "To Do") {
      todoColumn.appendChild(div);
      todoFound = true;
    } else if (task.status === "In Progress") {
      inProgressColumn.appendChild(div);
      inProgressFound = true;
    } else if (task.status === "Completed") {
      completedColumn.appendChild(div);
      completedFound = true;
    }
  });

  if (!todoFound) {
    todoColumn.innerHTML = `<p class="empty-message">تسکی یافت نشد ☁️</p>`;
  }
  if (!inProgressFound) {
    inProgressColumn.innerHTML = `<p class="empty-message">تسکی یافت نشد ☁️</p>`;
  }
  if (!completedFound) {
    completedColumn.innerHTML = `<p class="empty-message">تسکی یافت نشد ☁️</p>`;
  }
}

// حذف تسک
async function deleteTask(id) {
  await fetch(`${apiURL}/${id}`, { method: "DELETE" });
  loadTasks();
}

// باز کردن فرم ویرایش
function openEditModal(id) {
  currentEditTaskId = id;
  const task = tasks.find(t => t.id === id);

  document.getElementById("editName").value = task.name;
  document.getElementById("editStatus").value = task.status;
  document.getElementById("editPriority").value = task.priority;
  document.getElementById("editDescription").value = task.description || "";

  document.getElementById("editModal").style.display = "block";
}

// بستن مدال ویرایش
function closeEditModal() {
  document.getElementById("editModal").style.display = "none";
  currentEditTaskId = null;
}

// ارسال تغییرات ویرایش
document.getElementById("editForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("editName").value.trim();
  const status = document.getElementById("editStatus").value;
  const priority = document.getElementById("editPriority").value;
  const description = document.getElementById("editDescription").value;

  if (!name || !status || !priority) return;

  const updatedTask = {
    name,
    status,
    priority,
    description,
    createdAt: new Date().toISOString(),
  };

  await fetch(`${apiURL}/${currentEditTaskId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedTask),
  });

  loadTasks();
  closeEditModal();
});

// افزودن تسک جدید
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = form.name.value.trim();
  const status = form.status.value;
  const priority = form.priority.value;
  const description = form.description.value.trim();

  if (!name || !status || !priority || !description) return;

  const newTask = {
    name,
    status,
    priority,
    description,
    createdAt: new Date().toISOString(),
  };

  await fetch(apiURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newTask),
  });

  form.reset();
  loadTasks();
});

// بارگذاری اولیه و اعمال فیلتر و جستجو
async function loadTasks() {
  tasks = await fetchTasks();
  let filteredTasks = tasks;

  const priority = priorityFilter.value;
  if (priority) {
    filteredTasks = filteredTasks.filter(task => task.priority === priority);
  }

  const searchTerm = searchInput.value.trim().toLowerCase();
  if (searchTerm) {
    filteredTasks = filteredTasks.filter(task =>
      task.name.toLowerCase().includes(searchTerm)
    );
  }

  renderTasks(filteredTasks);
}

searchInput.addEventListener("input", loadTasks);
priorityFilter.addEventListener("change", loadTasks);

loadTasks();





















