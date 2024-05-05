const formCreate = document.getElementById("form-create");
const formEdit = document.getElementById("form-edit");
const listGroupTodo = document.getElementById("list-group-todo");
const messageCreate = document.getElementById("message-create");
const time = document.getElementById("time");
const modal = document.getElementById("modal");
const overlay = document.getElementById("overlay");
/* time elements */
const fullDay = document.getElementById("full-day");
const hourEl = document.getElementById("hour");
const minuteEl = document.getElementById("minute");
const secondEl = document.getElementById("second");
const closeEl = document.getElementById("close");

let editItemId;

let todos = JSON.parse(localStorage.getItem("list"))
  ? JSON.parse(localStorage.getItem("list"))
  : [];

if (todos.length) showTodos();

function setTodos() {
  localStorage.setItem("list", JSON.stringify(todos));
}

function getTime() {
  const now = new Date();
  const data = now.getDate() < 10 ? "0" + now.getDate() : now.getDate();
  const month =
    now.getMonth() < 10 ? "0" + (now.getMonth() + 1) : now.getMonth();
  const year = now.getFullYear();

  const hour = now.getHours();
  const minutes =
    now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes();
  const second =
    now.getSeconds() < 10 ? "0" + now.getSeconds() : now.getSeconds();

  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const monthTitle = now.getMonth();
  fullDay.textContent = `${data} ${months[monthTitle]} ${year}`;

  hourEl.textContent = `${hour}`;
  minuteEl.textContent = `${minutes}`;
  secondEl.textContent = `${second}`;

  return `${hour}:${minutes}, ${data}.${month}.${year}`;
}

setInterval(getTime, 1000);

function showTodos() {
  const todos = JSON.parse(localStorage.getItem("list"));
  listGroupTodo.innerHTML = "";
  todos.forEach((item, i) => {
    listGroupTodo.innerHTML += `
        <li ondblclick="setCompleted(${i})" class="list-group-item d-flex justify-content-between mb-3 border border-dark ${
      item.completed == true ? "complated" : ""
    }">
        ${item.text}
        <div class="todo-icons">
          <span class="opacity-50 me-2">${item.time}</span>
          <img onclick=(editTodos(${i})) src="./img/edit.svg" alt="edit icon" width="25" height="25">
          <img onclick=(deleteTodos(${i})) src="./img/delete.svg" alt="delete icon" width="25" height="25">
        </div>
      </li>
        `;
  });
}

function showMessage(where, message) {
  document.getElementById(`${where}`).textContent = message;

  setTimeout(() => {
    document.getElementById(`${where}`).textContent = "";
  }, 2500);
}

formCreate.addEventListener("submit", (e) => {
  e.preventDefault();
  const textEl = formCreate["input-create"].value.trim() || "";

  formCreate.reset();
  if (textEl.length) {
    todos.push({ text: textEl, time: getTime(), completed: false });
    setTodos();
    showTodos();
  } else {
    showMessage("message-create", "Please, Enter some todo ...");
  }
});

function deleteTodos(id) {
  const deletedTodos = todos.filter((item, i) => {
    return i !== id;
  });

  todos = deletedTodos;
  setTodos();
  showTodos();
}

function setCompleted(id) {
  const completedTodos = todos.map((item, i) => {
    if (id == i) {
      return { ...item, completed: item.completed == true ? false : true };
    } else {
      return { ...item };
    }
  });

  todos = completedTodos;

  setTodos();
  showTodos();
}

formEdit.addEventListener("submit", (e) => {
  e.preventDefault();

  const textEl = formEdit["input-edit"].value.trim() || "";

  formEdit.reset();
  if (textEl.length) {
    todos.splice(editItemId, 1, {
      text: textEl,
      time: getTime(),
      completed: false,
    });
    setTodos();
    showTodos();
    close();
  } else {
    showMessage("message-edit", "Please, Enter some todo ...");
  }
});

function editTodos(id) {
  open();

  editItemId = id;
}

overlay.addEventListener("click", close);
closeEl.addEventListener("click", close);

document.addEventListener("keydown", (e) => {
  if (e.which == 27) {
    close();
  }
});

function open() {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
}

function close() {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
}
