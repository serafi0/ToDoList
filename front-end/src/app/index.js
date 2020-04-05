//add task
//delete task
//TODO edit task
//make task done

const config = require("./config");
// var n = localStorage.getItem("");

class Task {
  constructor(content, discription) {
    this.content = content;
    this.discription = discription;
    this.done = false;
    this.count = "id" + new Date().getTime();



    API.addTask(content, this.count, discription);
  }
}
var x

class API {
static getCounter(){
  return fetch(config.url +`/counter`).then((response) => response.json())
   .then((data) => {
    var names = JSON.stringify(data.num);
    console.log(names)
    return names;
    // console.log(names.num)

}

);


}


  static getOneTaskWithId(id) {
    fetch(config.url + `/tasks/${id}`)
      .then((response) => response.json())
      .then((data) => {
        UI.addEditFormWithId(data);
      });
    // return entry;
  }

  static getAll() {
    fetch(config.url + "/tasks")
      .then((response) => response.json())
      .then((data) => {
        UI.displayTasks(data);
      });
  }

  static addTask(title, id, details) {
    fetch(config.url + "/tasks", {
      headers: { "Content-Type": "application/json; charset=utf-8" },
      method: "POST",
      body: JSON.stringify({
        content: title,
        done: false,
        count: id,
        discription: details,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          UI.showAlert(data.message, "dark", 7000);
        }
        if (data.discription) {
          UI.addTaskToList(data);
        } else {
        }
      });
  }

  static editTaskByID(id, title, details) {
    fetch(config.url + `/tasks/${id}`, {
      method: "PUT", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: title,
        count: id,
        discription: details,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          UI.showAlert(data.message, "dark", 7000);
        }
      });
  }

  static deleteTaskbyID(id) {
    fetch(config.url + `/tasks/${id}`, {
      method: "DELETE",
    });

    // .then(res=>res.json()).then(data=>{if(data.message){UI.showAlert(data.message,'dark',7000)}})
  }

  static clearALL() {
    fetch(config.url + `/clear`, {
      method: "DELETE",
    });
  }
  static maekItDoneOrUncheck(id, CurrentState) {
    fetch(config.url + `/tasks/toggleDone/${id}`, {
      method: "PUT", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        done: CurrentState,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          UI.showAlert(data.message, "dark", 7000);
        }
        console.log(data);
        if (CurrentState) {
          UI.addTaskToList(data);
        } else {
          UI.addTaskToDone(data);
        }
      });
  }
}

class UI {
  static displayTasks(t) {
    console.log(t);

    t.forEach((task) => {
      if (task.done) {
        UI.addTaskToDone(task);
      } else {
        UI.addTaskToList(task);
      }
    });
  }

  static async addTaskToList(task) {
    const tasks = document.querySelector("#tasks-list");
    const field = document.createElement("div");
    field.classList.add("mt-2");
    field.classList.add("task");

    // let number = await API.getCounter();

    field.id = task._id;

    field.innerHTML = `<div class="card" id=${task._id}>
    <div class="card-header">
    <p class="h5 card-title font-weight-bold">${task.content}</p>
    </div>
    <div class="card-body">

    <p class="lead">
    ${task.discription}
    </p>
    <div class="btn-group"  role="group">

    <button class="btn btn-success done"> done</button><button class="btn btn-secondary edit"> edit</button>
    <button class="btn btn-danger delete ">&times</button>
    </div>


    </div>

    `;

    tasks.appendChild(field);
  }

  static addTaskToDone(task) {
    const tasks = document.querySelector("#done-list");
    const field = document.createElement("div");
    field.classList.add("mt-2");
    field.classList.add("task");

    field.id = task._id;

    field.innerHTML = `<div class="card" id=${task._id}>
                      <div class="card-header">
                      <p class="card-title font-weight-bold">${task.content}</p>
                      </div>
                      <div class="card-body">
                      
                      <p class="lead card-text">
                        ${task.discription}
                      </p>  
                      <div class="btn-group"  role="group">
                      
                      <button class="btn btn-success uncheck"> uncheck</button>
                      <button class="btn btn-danger delete ">&times</button>
                      </div>
                      
                      
                      </div>
                      
                      


                      `;

    tasks.appendChild(field);
  }

  static removeTask(el) {
    if (el.classList.contains("delete")) {
      const parent = el.parentElement.parentElement.parentElement;
      console.log(parent.id);
      //  Store.removeTask(parent.id);
      API.deleteTaskbyID(parent.id);
      parent.remove();

      // localStorage.setItem("", --n);
    }
  }

  static showAlert(message, className, timeOUT) {
    const div = document.createElement("div");

    div.className = `alert alert-${className}`;
    // div.style = `z-index: 9999 !important;`;

    div.appendChild(document.createTextNode(message));

    const container = document.querySelector(".container");
    const form = document.querySelector("#task-entry33");

    container.insertBefore(div, form);

    //vanish in 5 seconds

    setTimeout(() => document.querySelector(".alert").remove(), timeOUT);
  }

  static addEditFormWithId(task) {
    const oldForm = document.querySelector(`form#${task._id}`);
    if (!oldForm) {
      const taskCard = document.getElementById(task._id);

      const editForm = document.createElement("form");
      editForm.classList.add(".formEdit");
      editForm.id = task._id;

      editForm.innerHTML = `
         
                          <div class="card">
                          <div class="card-body">
                          <div class="form-group">
                          <label for="content">
                            edit title
                          </label>
                          <input type="text" class="form-control" id="content-edit-${task._id}" value="${task.content}">
                          <div class="form-group mt-4">
                            <label for="discription"> edit discription</label>
                          <textarea name="discription" id="discription-edit-${task._id}" rows="3" class="form-control">${task.discription}</textarea>
                          </div>


                          </div>
                          <button  class="btn btn-primary editSubmit"> Edit </button>
                          </div>
                          </div>


                          `;

      taskCard.appendChild(editForm);
    } else {
      oldForm.remove();
    }
  }
}

//storage

//events

document.addEventListener("DOMContentLoaded", API.getAll);


document.querySelector("#task-entry").addEventListener("submit", async(e) => {
  //pervert acualt subit

  e.preventDefault();
  //getting form values
  let counter = await API.getCounter()
  if (counter < 20) {
    const content = document.querySelector("#content").value;
    const dis = document.querySelector("#discription").value;

    const task = new Task(content, dis);
    task.done = false;
    //  API.addTask(task)

    //  UI.addTaskToList(task)
    //  Store.addTask(task)
    // UI.showAlert('task added','success',4000)

    console.log(task);

  } else {
    UI.showAlert("sorry you can onlu add 20 tasks ", "danger", 7000);
  }
});

document.querySelector("#tasks-list").addEventListener("click", (e) => {
  console.log(e.target);
  const el = e.target;
  const parent = el.parentElement.parentElement.parentElement;
  id = parent.id;

  if (el.classList.contains("delete")) {
    UI.removeTask(el);
    UI.showAlert("task deleted", "danger", 4000);
  }

  //same for done

  if (el.classList.contains("editSubmit")) {
    e.preventDefault();

    const content = document.querySelector(`#content-edit-${id}`).value;
    const dis = document.querySelector(`#discription-edit-${id}`).value;
    const card = document.querySelector(`div#${id}.card`);
    console.log(card);
    card.innerHTML = `
                        <div>
                        <div class="card" id=${id}>
                    <div class="card-header">
                    <p class="h5 font-weight-bold">${content}</p>
                    </div>
                    <div class="card-body">

                    <p class="lead">
                    ${dis}
                    </p>
                    <div class="btn-group"  role="group">

                    <button class="btn btn-success done"> done</button><button class="btn btn-secondary edit"> edit</button>
                    <button class="btn btn-danger delete ">&times</button>
                    </div>


                    </div>
                    </div>
      `;

    // text.innerHTML = content;

    // Store.editTask(id,content,dis);
    API.editTaskByID(id, content, dis);
    parent.remove();

    UI.showAlert("edited", "warning", 6000);

    // UI.displayTasks();

    console.log(id);
    // parent.remove();
  }

  if (el.classList.contains("edit")) {
    API.getOneTaskWithId(id);
  }

  if (el.classList.contains("done")) {
    parent.remove();
    // console.log(id);

    API.maekItDoneOrUncheck(id, false);

    //  tasks =Store.getTasks();
  }
});

document.querySelector("#done-list").addEventListener("click", (e) => {
  const el = e.target;
  const parent = el.parentElement.parentElement.parentElement;
  id = parent.id;
  e.preventDefault();

  // tasks =Store.getTasks();

  // if(el.classList.contains('edit')){
  //   UI.addEditFormWithId(id)
  // }

  if (el.classList.contains("uncheck")) {
    UI.showAlert("task unchecked", "sucess", 4000);
    API.maekItDoneOrUncheck(id, true);
    // UI.addTaskToList()
    parent.remove();
  }

  if (el.classList.contains("delete")) {
    UI.removeTask(el);
    UI.showAlert("task deleted and Done", "primary", 4000);
  }
});

document.querySelector(".clearAll").addEventListener("click", (e) => {
  e.preventDefault();

  //==> storage localStorage.clear();
  // n = 0;
  UI.showAlert("every thing was deleted", "secondary", 5000);

  API.clearALL();

  document.querySelectorAll(".task").forEach((task) => task.remove());
});
