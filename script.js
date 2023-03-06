const btn = document.querySelector(".todo--btn");
const input = document.querySelector(".todo--field");
const taskContainer = document.querySelector(".task--container");
const modalYes = document.querySelector(".modal-yes");
const modalNo = document.querySelector(".modal-no");
const modalCheck = document.querySelector(".modal--check");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const filter = document.querySelector(".filter--btn");
const filterOptions = document.querySelector(".filter--options");

class Task {
  constructor(title, active = true) {
    this.title = title;
    this.active = active;
    this.id = Math.random();
    this.elements = {};
  }
}

class App {
  #modal = true;
  #taskArr = [];
  #curTask;
  constructor() {
    document.addEventListener("keydown", this._newTask.bind(this));
    btn.addEventListener("click", this._newTask.bind(this));
    modalNo.addEventListener("click", this._modalHandler.bind(this));
    modalYes.addEventListener("click", this._modalHandler.bind(this));
    filter.addEventListener("click", function () {
      filterOptions.classList.toggle("hidden");
    });
    filterOptions.addEventListener("click", this._filterHandler.bind(this));
  }

  _filterHandler(e) {
    if (!e.target.classList.contains("option")) return;
    const btn = e.target.innerHTML;
    if (btn === "All") this._filterAll();
    if (btn === "Active") this._filterActive();
    if (btn === "Inactive") this._filterInactive();
    if (btn === "Deleted") this._filterDeleted();
  }

  _filterAll() {
    this.#taskArr.forEach((task) =>
      task.elements.task.classList.remove("hidden")
    );
  }
  _filterActive() {
    this.#taskArr
      .filter((task) => !task.active || task.deleted)
      .forEach((task) => task.elements.task.classList.add("hidden"));
    this.#taskArr
      .filter((task) => task.active && !task.deleted)
      .forEach((task) => task.elements.task.classList.remove("hidden"));
  }
  _filterInactive() {
    this.#taskArr
      .filter((task) => task.active)
      .forEach((task) => task.elements.task.classList.add("hidden"));
    this.#taskArr
      .filter((task) => !task.active)
      .forEach((task) => task.elements.task.classList.remove("hidden"));
  }
  _filterDeleted() {
    this.#taskArr
      .filter((task) => !task.deleted)
      .forEach((task) => task.elements.task.classList.add("hidden"));
    this.#taskArr
      .filter((task) => task.deleted)
      .forEach((task) => task.elements.task.classList.remove("hidden"));
  }

  _newTask(e, title = "") {
    const value = title !== "" ? title : input.value;
    const key = e?.key ?? "Enter";
    if (key !== "Enter" || value === "") return;
    const task = new Task(value);
    this.#taskArr.push(task);
    input.value = "";
    this._renderTask(task);
  }

  _renderTask(task) {
    const markup = `
        <div class="task">
          <input class="task--check" type="checkbox" />
          <input
          placeholder="Edit title here"
          maxlength="75"
          class="task--field hidden"
          type="text"
          value=${task.title}
          />
          <span class="task--title">${task.title}</span>
          <img class="task--edit" src="img/edit-button.png" alt="" />
          <div class="task--btn-container hidden">
            <div class="task--confirm task--btn">Confirm</div>
            <div class="task--copy task--btn">Copy</div>
            <div class="task--delete task--btn">Delete</div>
          </div>
          
        </div>
    `;
    taskContainer.insertAdjacentHTML("afterbegin", markup);
    this._generateTaskFeatures(task);
  }

  _clickHandler(task, e) {
    const target = e.target;
    if (!target.classList.contains("task--btn")) return;
    if (target.classList.contains("task--confirm")) this._confirmTask(task);
    if (target.classList.contains("task--copy")) this._copyTask(task);
    if (target.classList.contains("task--delete")) this._modal(task);
    this._viewTaskFeatures(task);
  }

  _generateTaskFeatures(task) {
    const checkbox = document.querySelector(".task--check");
    const edit = document.querySelector(".task--edit");
    task.elements.taskBtnContainer = document.querySelector(
      ".task--btn-container"
    );
    task.elements.taskInput = document.querySelector(".task--field");
    task.elements.titleElement = document.querySelector(".task--title");
    task.elements.task = document.querySelector(".task");

    task.elements.taskBtnContainer.addEventListener(
      "click",
      this._clickHandler.bind(this, task)
    );

    checkbox.addEventListener("change", this._inactiveTask.bind(this, task));
    edit.addEventListener("click", this._viewTaskFeatures.bind(this, task));
  }

  _inactiveTask(task, e) {
    task.elements.task.classList.toggle("inactive");
    task.active = !task.active;
  }

  _viewTaskFeatures(task) {
    if (!task.active) return;
    task.elements.taskBtnContainer.classList.toggle("hidden");
    task.elements.taskInput.classList.toggle("hidden");
    task.elements.titleElement.classList.toggle("hidden");
  }

  _confirmTask(task) {
    task.title = task.elements.taskInput.value;
    task.elements.titleElement.innerHTML = task.title;
  }

  _copyTask(task) {
    this._newTask("Enter", task.title);
  }

  _modal(task) {
    if (!this.#modal) {
      this._deleteTask(task);
      return;
    }
    this.#curTask = task;
    modal.classList.toggle("hidden");
    overlay.classList.toggle("hidden");
  }

  _modalHandler(e) {
    if (e.target.innerHTML === "Yes") this._deleteTask(this.#curTask);
    if (modalCheck.checked) this.#modal = false;
    modal.classList.toggle("hidden");
    overlay.classList.toggle("hidden");
  }

  _deleteTask(curTask) {
    const task = this.#taskArr.find((task) => task.id === curTask.id);

    task.elements.task.classList.toggle("hidden");
    task.elements.task.style.color = "#A52A2A";
    task.deleted = true;
  }
}

const app = new App();
