const server = "http://localhost:7070/";
const taskBoxList = document.querySelector(".task-box__list");
const taskBoxBtn = document.querySelector(".task-box__btn");
const modalAdd = document.querySelector(".modal-add");
const modalButtonOkAdd = document.querySelector(".modal__button-ok-add");
const modalButtonCancelAdd = document.querySelector(
  ".modal__button-cancel-add"
);
const modalTextBriefAdd = document.querySelector(".modal__text-brief-add");
const modalTextFullAdd = document.querySelector(".modal__text-full-add");
const modalRedact = document.querySelector(".modal-redact");
const modalDelete = document.querySelector(".modal-delete");
const modalButtonOkRedact = document.querySelector(".modal__button-ok-redact");
const modalButtonCancelRedact = document.querySelector(
  ".modal__button-cancel-redact"
);
const modalButtonOkDelete = document.querySelector('.modal__button-ok-delete');
const modalButtonCancelDelete = document.querySelector('.modal__button-cancel-delete');
const modalTextBriefRedact = document.querySelector(
  ".modal__text-brief-redact"
);
const modalTextFullRedact = document.querySelector(".modal__text-full-redact");
let taskBoxContentAll = null;
let taskBoxRedactAll = null;
let taskBoxCloseAll = null;
let idTiketRedact = null;
let idTiketDelete = null;


document.addEventListener("DOMContentLoaded", (evt) => {
  evt.preventDefault();

  const params = new URLSearchParams();

  params.append("method", "allTickets");

  const xhr = new XMLHttpRequest();

  xhr.open("GET", `${server}?${params}`);
  xhr.send();

  xhr.addEventListener("load", () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        const data = JSON.parse(xhr.responseText);
        loadTask(data);
      } catch (e) {
        console.error(e);
      }
    }
  });
});

function loadTask(data) {
  taskBoxList.innerHTML = "";
  data.forEach((element) => {
    taskBoxList.insertAdjacentHTML(
      "beforeend",
      `<li class="list__task" id='${element.id}'>
          <div class="box">
          <div class="task-box__content">
          <input type="checkbox" ${element.status}/>
          <span class="task-box__text">${element.name}</span>
        </div>
        <div class="task-box__control">
          <div class="task-box__data">${element.created}</div>
          <div class="task-box__close">&#10006;</div>
          <div class="task-box__redact">&#9998;</div>
        </div>
          </div>
          <div class="list__task_description"></div>
      </li>`
    );
  });

  taskBoxRedactClik();
  taskBoxCloseClik();
  taskBoxContentAllClik();
}

function taskBoxRedactClik() {
  taskBoxRedactAll = document.querySelectorAll(".task-box__redact");
  Array.from(taskBoxRedactAll);

  taskBoxRedactAll.forEach((taskBoxRedact) => {
    taskBoxRedact.addEventListener("click", (e) => {
      modalRedact.classList.remove("modal--none");
      idTiketRedact = e.target.parentNode.parentNode.parentNode.id;
      modalTextBriefRedact.value =
        e.target.parentNode.parentNode.querySelector(
          ".task-box__text"
        ).textContent;
      gettingTheFullDescription(idTiketRedact, modalTextFullRedact, "value");
    });
  });
}

function taskBoxCloseClik() {
  taskBoxCloseAll = document.querySelectorAll(".task-box__close");
  Array.from(taskBoxCloseAll);

  taskBoxCloseAll.forEach((taskBoxClose) => {
    taskBoxClose.addEventListener("click", (e) => {
      modalDelete.classList.remove("modal--none");
      idTiketDelete = e.target.parentNode.parentNode.parentNode.id;
    });
  });
}

modalButtonOkDelete.addEventListener("click", (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("method", "deleteTicket");
  formData.append("id", idTiketDelete);
  const xhr = new XMLHttpRequest();

  xhr.open("POST", `${server}`);
  xhr.send(formData);

  xhr.addEventListener("load", () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        const data = JSON.parse(xhr.responseText);
        loadTask(data);
      } catch (e) {
        console.error(e);
      }
    }
  });

  modalDelete.classList.add("modal--none");
});

modalButtonCancelRedact.addEventListener("click", (e) => {
  e.preventDefault();
  modalRedact.classList.add("modal--none");
});

modalButtonCancelDelete.addEventListener("click", (e) => {
  e.preventDefault();
  modalDelete.classList.add("modal--none");
});

modalButtonOkRedact.addEventListener("click", (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("method", "editTicket");
  formData.append("id", idTiketRedact);
  formData.append("name", modalTextBriefRedact.value);
  formData.append("description", modalTextFullRedact.value);
  const xhr = new XMLHttpRequest();

  xhr.open("POST", `${server}`);
  xhr.send(formData);

  xhr.addEventListener("load", () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        const data = JSON.parse(xhr.responseText);
        loadTask(data);
      } catch (e) {
        console.error(e);
      }
    }
  });

  modalRedact.classList.add("modal--none");
});

taskBoxBtn.addEventListener("click", () => {
  modalAdd.classList.remove("modal--none");
});



modalButtonOkAdd.addEventListener("click", (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("method", "createTicket");
  formData.append("name", modalTextBriefAdd.value);
  formData.append("description", modalTextFullAdd.value);
  const xhr = new XMLHttpRequest();

  xhr.open("POST", `${server}`);
  xhr.send(formData);

  xhr.addEventListener("load", () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        const data = JSON.parse(xhr.responseText);
        loadTask(data);
      } catch (e) {
        console.error(e);
      }
    }
  });

  modalAdd.classList.add("modal--none");
});

modalButtonCancelAdd.addEventListener("click", (e) => {
  e.preventDefault();
  modalAdd.classList.add("modal--none");
});

function taskBoxContentAllClik() {
  taskBoxContentAll = document.querySelectorAll(".task-box__content");
  Array.from(taskBoxContentAll);

  taskBoxContentAll.forEach((taskBoxContent) => {
    taskBoxContent.addEventListener("click", (e) => {
        let listTask = taskBoxContent.parentNode.parentNode;
        let id = listTask.id;
        let listTaskDescription = listTask.querySelector(
          ".list__task_description"
        );

        if(listTaskDescription.textContent ==='') {
          gettingTheFullDescription(id, listTaskDescription, "textContent");
        } else {
          listTaskDescription.textContent = ''
        }
        
    });
  });
}

function gettingTheFullDescription(id, listTaskDescription, value) {
  const params = new URLSearchParams();

  params.append("method", "ticketById&id");
  params.append("id", id);

  const xhr = new XMLHttpRequest();

  xhr.open("GET", `${server}?${params}`);
  xhr.send();

  xhr.addEventListener("load", () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        const data = JSON.parse(xhr.responseText);
        listTaskDescription[`${value}`] = data.description;
      } catch (e) {
        console.error(e);
      }
    }
  });
}
