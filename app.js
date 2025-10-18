const { ref, push, onValue, remove } = window.firebaseRefs;
const db = window.db;

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

// Listen for database updates
function loadTasks() {
  const tasksRef = ref(db, "tasks/");
  onValue(tasksRef, (snapshot) => {
    taskList.innerHTML = ""; // clear old list
    const data = snapshot.val();
    if (data) {
      Object.keys(data).forEach((key) => {
        const taskText = data[key].text;
        const li = document.createElement("li");
        li.className = "task-item";
        li.innerHTML = `
          <span>${taskText}</span>
          <span class="delete-btn" data-id="${key}">🗑️</span>
        `;
        taskList.appendChild(li);
      });
    } else {
      taskList.innerHTML = "<p>No tasks yet</p>";
    }
  });
}

// Add new task
addBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  if (text === "") return;
  push(ref(db, "tasks/"), { text });
  taskInput.value = "";
});

// Delete a task
taskList.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const id = e.target.getAttribute("data-id");
    remove(ref(db, `tasks/${id}`));
  }
});

// Load tasks initially
loadTasks();
