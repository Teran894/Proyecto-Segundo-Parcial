//#region 1 MODELO DE DATOS
class Task {
  constructor(id, title, description, completed, priority, dueDate, tag) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.completed = completed;
    this.priority = priority;
    this.dueDate = dueDate;
    this.tag = tag;

  }
}

function mapAPIToTasks(data) {
  return data.map(item => {
    return new Task(
      item.id,
      item.title,
      item.description,
      item.completed,
      item.priority,
      new Date(item.dueDate),
      item.tag
    );
  });
}

class TaskDescriptor {

  constructor(id, title, priority) {
    this.id = id;
    this.title = title;
    this.priority = priority;
  }

}


function mapAPIToTaskDescriptors(data) {
  return data.map(task => {
    return new TaskDescriptor(
      task.id,
      task.title,
      task.priority
    );
  });
}

//#endregion

//#region 2 VENTAS VIEW
function displayTasksView(tasks) {

  clearTable();

  showLoadingMessage();

  if (tasks.length === 0) {

    showNotFoundMessage();

  } else {

    hideMessage();

    displayTasksTable(tasks);
  }

}

function displayClearTasksView() {
  clearTable();

  showInitialMessage();
}

function displayTasksTable(tasks) {
  const tablaBody = document.getElementById('data-table-body');

  tasks.forEach(task => {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${task.id}</td>
        <td class="editable" contenteditable="false">${task.title}</td>
        <td class="editable" contenteditable="false">${task.description}</td>
        <td class="editable" contenteditable="false">${task.completed}</td>
        <td class="editable" contenteditable="false">${task.priority}</td>
        <td class="editable" contenteditable="false">${formatDate(task.dueDate)}</td>
        <td class="editable" contenteditable="false">${task.tag}</td>
        <td>
          <button class="btn-update" data-task-id="${task.id}">Editar</button>
          <button class="btn-delete" data-task-id="${task.id}">Eliminar</button>
        </td>
      `;

    const editButton = row.querySelector('.btn-update');
    editButton.addEventListener('click', () => {
      toggleEditRow(row);
    });

    tablaBody.appendChild(row);
  });

  initDeleteTaskButtonHandler();
}

function clearTable() {
  const tableBody = document.getElementById('data-table-body');

  tableBody.innerHTML = '';
}

function showLoadingMessage() {
  const message = document.getElementById('message');

  message.innerHTML = 'Cargando...';

  message.style.display = 'block';
}

function showInitialMessage() {
  const message = document.getElementById('message');

  message.innerHTML = 'No se ha realizado una consulta de notas.';

  message.style.display = 'block';
}

function showNotFoundMessage() {
  const message = document.getElementById('message');

  message.innerHTML = 'No se encontraron notas con el filtro proporcionado.';

  message.style.display = 'block';
}

function hideMessage() {
  const message = document.getElementById('message');

  message.style.display = 'none';
}

function toggleEditRow(row) {

  const editButton = row.querySelector('.btn-update');
  const taskId = editButton.getAttribute('data-task-id');
  const editableCells = row.querySelectorAll('.editable');

  if (editButton.textContent === 'Editar') {
    editButton.textContent = 'Guardar';
    editButton.classList.add('btn-update-saving');
    editableCells.forEach(cell => {
      cell.contentEditable = 'true';



    });
  } else {
    editButton.textContent = 'Editar';
    editButton.classList.remove('btn-update-saving');
    editableCells.forEach(cell => {
      cell.contentEditable = 'false';


    });

    const taskData = {
      id: taskId,
      title: row.cells[1].textContent,
      description: row.cells[2].textContent,
      completed: row.cells[3].textContent,
      priority: row.cells[4].textContent,
      dueDate: row.cells[5].textContent,
      tag: row.cells[6].textContent,
    };

    saveEdit(taskId, taskData);
  };
}

//#endregion

//#region 3 FILTROS
function initFilterButtonsHandler() {
  document.getElementById('filter-form').addEventListener('submit', event => {
    event.preventDefault();
    searchTasks();
  });
  document.getElementById('reset-filters').addEventListener('click', () => clearTasks());
}

function clearTasks() {
  document.querySelector('select.filter-field').selectedIndex = 0;
  document.querySelectorAll('input.filter-field').forEach(input => input.value = '');
  displayClearTasksView();
}

function resetTasks() {
  document.querySelector('select.filter-field').selectedIndex = 0;
  document.querySelectorAll('input.filter-field').forEach(input => input.value = '');
  searchTasks();
}

function searchTasks() {
  const title = document.getElementById('title-filter').value;
  const priority = document.getElementById('priority-filter').value;
  const completed = document.getElementById('completed-filter').value;
  const dueDate = document.getElementById('date-filter').value;
  const tag = document.getElementById('tag-filter').value;

  getTasksData(title, priority, completed, dueDate, tag);
}

//#endregion

//#region 4 BOTONES PARA AGREGAR Y ELIMINAR VENTAS
function initAddTaskButtonsHandler() {
  document.getElementById('addTask').addEventListener('click', () => {
    openAddTaskModal()
  });

  document.getElementById('modal-background').addEventListener('click', () => {
    closeAddTaskModal();
  });

  document.getElementById('task-form').addEventListener('submit', event => {
    event.preventDefault();
    processSubmitTask();
  });

}

function openAddTaskModal() {
  document.getElementById('task-form').reset();
  document.getElementById('modal-background').style.display = 'block';
  document.getElementById('modal').style.display = 'block';
}

function closeAddTaskModal() {
  document.getElementById('task-form').reset();
  document.getElementById('modal-background').style.display = 'none';
  document.getElementById('modal').style.display = 'none';
}

function processSubmitTask() {
  const title = document.getElementById('title-field').value;
  const description = document.getElementById('description-field').value;
  const completed = document.getElementById('completed-field').value;
  const priority = document.getElementById('priority-field').value;
  const dueDate = document.getElementById('dueDate-field').value;
  const tag = document.getElementById('tag-field').value;

  const taskToSave = new Task(
    null,
    title,
    description,
    completed,
    priority,
    dueDate,
    tag
  );
  createTask(taskToSave);
}

//#endregion

//#region 5 BORRAR
function initDeleteTaskButtonHandler() {

  document.querySelectorAll('.btn-delete').forEach(button => {

    button.addEventListener('click', () => {
      const taskId = button.getAttribute('data-task-id');
      deleteTask(taskId);
    });
  });
}

//#endregion

//#region 6 CARGAR DATOS PARA FORM
function displayTaskOptions(tasks) {
  const taskFilter = document.getElementById('task-filter');
  //const priorityFilter = document.getElementById('priority-filter');

  const taskModal = document.getElementById('priority-field');

  tasks.forEach(task => {
    const optionFilter = document.createElement('option');
    optionFilter.value = task.title;
    optionFilter.text = `${task.title} - ${task.priority}`;
    taskFilter.appendChild(optionFilter);
  });
}

//#endregion

//#region 7 CONSUMO DE DATOS DESDE API
function getTaskData() {
  fetchAPI(`${apiURL}/tasks`, 'GET')
    .then(data => {
      const tasksList = mapAPIToTaskDescriptors(data);
      displayTaskOptions(tasksList);
    });

}

function getTasksData(title, priority, completed, dueDate, tag) {
  const url = buildGetTasksDataUrl(title, priority, completed, dueDate, tag);
  fetchAPI(url, 'GET')
    .then(data => {
      const tasksList = mapAPIToTasks(data);
      displayTasksView(tasksList);
    });
}

function deleteTask(taskId) {
  const confirm = window.confirm(`¿Estás seguro de que deseas eliminar la nota ${taskId}?`);
  if (confirm) {
    fetchAPI(`${apiURL}/tasks/${taskId}`, 'DELETE')
      .then(() => {
        resetTasks();
        window.alert("Nota eliminada.");
      });
  }
}

function createTask(task) {
  fetchAPI(`${apiURL}/tasks`, 'POST', task)
    .then(task => {
      closeAddTaskModal();
      resetTasks();
      window.alert(`Nota ${task.id} creada correctamente.`);
    });
}

function saveEdit(taskId, taskData) {
  fetch(`${apiURL}/tasks/${taskId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskData),
  })
    .then(response => {
      if (response.ok) {
        console.log("Datos enviados")
      } else {
        console.error('Error al guardar los datos en el servidor');
      }
    })
    .catch(error => {
      console.error('Error en la solicitud HTTP:', error);
    });
}


function buildGetTasksDataUrl(title, priority, completed, dueDate, tag) {
  const url = new URL(`${apiURL}/tasks`);
  if (title) {
    url.searchParams.append('title', title);
  }

  if (priority) {
    url.searchParams.append('priority', priority);
  }

  if (dueDate) {
    url.searchParams.append('dueDate', dueDate);
  }
  if (completed) {
    url.searchParams.append('completed', completed);
  }

  if (tag) {
    url.searchParams.append('tag', tag);
  }
  return url;
}

//#endregion

//#region 8 INICIALIZARa FUNCIONALIDAD
initAddTaskButtonsHandler();

initFilterButtonsHandler();

getTaskData();

//#endregion