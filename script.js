let inputTask = document.getElementById("addTaskInput");
let addTaskBtn = document.getElementById("addTaskBtn");
let tasksList = document.querySelector("#tasks-list");
let filterSelect = document.getElementById("filterSelect");
let keyLocalStorage = "list_task";
let dbTasks = [];

getLocalStorageTask();
renderListTask();

inputTask.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    let tarefa = inputTask.value;

    addTask(tarefa);
  }
});

addTaskBtn.addEventListener("click", (e) => {
  let tarefa = inputTask.value;

  addTask(tarefa);
});

filterSelect.addEventListener("change", filterTask);

function addTask(tarefa) {
  if (!tarefa || tarefa.trim() === "") return;

  dbTasks.push({
    descricao: tarefa.trim(),
    concluida: false,
  });

  saveLocalStorageTask();
  renderListTask();
}

function createTagLI(taskObj) {
  if (!taskObj || !taskObj.descricao === "") {
    return null;
  }

  let newTask = document.createElement("li");
  newTask.classList.add("task");
  if (taskObj.concluida) {
    newTask.classList.add("taskConcluida");
  }

  let divTask = document.createElement("div");
  divTask.classList.add("divTask");

  let divIcons = document.createElement("div");
  divIcons.classList.add("divIcons");

  let checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = taskObj.concluida;

  let taskText = document.createElement("span");
  taskText.textContent = taskObj.descricao;

  checkbox.addEventListener("change", () => {
    taskObj.concluida = checkbox.checked;
    newTask.classList.toggle("taskConcluida");
    saveLocalStorageTask();
  });

  let editBtn = document.createElement("button");
  editBtn.classList.add("editBtn");
  editBtn.innerHTML = '<i class="bi bi-pencil-square"></i>';

  let deleteBtn = document.createElement("button");
  deleteBtn.classList.add("deleteBtn");
  deleteBtn.innerHTML = '<i class="bi bi-trash"></i>';
  deleteBtn.addEventListener("click", () => {
    deleteTask(taskObj, newTask);
  });

  divTask.appendChild(checkbox);
  divTask.appendChild(taskText);

  divIcons.appendChild(editBtn);
  divIcons.appendChild(deleteBtn);

  newTask.appendChild(divTask);
  newTask.appendChild(divIcons);

  return newTask;
}

function deleteTask(taskObj, liElement) {
  let confirmacao = confirm("tem certeza que deseja excluir essa tarefa?");
  if (confirmacao) {
    const index = dbTasks.indexOf(taskObj);
    if (index - 1) {
      dbTasks.splice(index, 1);
      saveLocalStorageTask();
    }
    tasksList.removeChild(liElement);
  }
}

function renderListTask() {
  tasksList.innerHTML = "";
  for (let i = 0; i < dbTasks.length; i++) {
    let li = createTagLI(dbTasks[i]);
    if (li) {
      tasksList.appendChild(li);
    }
  }
  inputTask.value = "";
}

function filterTask() {
  let allTasks = document.querySelectorAll(".task");

  allTasks.forEach((task) => {
    switch (filterSelect.value) {
      case "concluidas":
        task.style.display = task.classList.contains("taskConcluida")
          ? "flex"
          : "none";
        break;
      case "aFazer":
        task.style.display = task.classList.contains("taskConcluida")
          ? "none"
          : "flex";
        break;
      default:
        task.style.display = "flex";
        break;
    }
  });
}

function saveLocalStorageTask() {
  localStorage.setItem(keyLocalStorage, JSON.stringify(dbTasks));
}

function getLocalStorageTask() {
  if (localStorage.getItem(keyLocalStorage)) {
    dbTasks = JSON.parse(localStorage.getItem(keyLocalStorage));
  }
}
