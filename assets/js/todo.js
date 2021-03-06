(function() {
  "use strict";
  var ENTER_KEY = 13;
  var newTodoDom = document.getElementById("new-todo");
  var syncDom = document.getElementById("sync-wrapper");
  var db = new PouchDB("todos");
  var remoteCouch = "false";
  db.changes({
    since: "now",
    live: true
  }).on("change", showTodos);
  function addTodo(text) {
    var todo = {
      _id: new Date().toISOString(),
      title: text,
      completed: false
    };
    db.put(todo, function callback(err, result) {
      if (!err) {
        console.log("Úkol byl úspěšně přidán!");
      }
    });
  }
  function showTodos() {
    db.allDocs({ include_docs: true, descending: true }, function(err, doc) {
      redrawTodosUI(doc.rows);
    });
  }
  function checkboxChanged(todo, event) {
    todo.completed = event.target.checked;
    db.put(todo);
  }
  function deleteButtonPressed(todo) {
    db.remove(todo);
  }
  function todoBlurred(todo, event) {
    var trimmedText = event.target.value.trim();
    if (!trimmedText) {
      db.remove(todo);
    } else {
      todo.title = trimmedText;
      db.put(todo);
    }
  }
  function sync() {
    syncDom.setAttribute("data-sync-state", "syncing");
    var opts = { live: true };
    db.replicate.to(remoteCouch, opts, syncError);
    db.replicate.from(remoteCouch, opts, syncError);
  }
  function syncError() {
    syncDom.setAttribute("data-sync-state", "error");
  }
  function todoDblClicked(todo) {
    var div = document.getElementById("li_" + todo._id);
    var inputEditTodo = document.getElementById("input_" + todo._id);
    div.className = "editing";
    inputEditTodo.focus();
  }
  function todoKeyPressed(todo, event) {
    if (event.keyCode === ENTER_KEY) {
      var inputEditTodo = document.getElementById("input_" + todo._id);
      inputEditTodo.blur();
    }
  }
  function createTodoListItem(todo) {
    /*var checkbox = document.createElement("input");*/
    /*checkbox.className = "toggle";*/
    /*checkbox.type = "checkbox";*/
    /*checkbox.addEventListener("change", checkboxChanged.bind(this, todo));*/
    var label = document.createElement("label");
    label.appendChild(document.createTextNode(todo.title));
    label.addEventListener("dblclick", todoDblClicked.bind(this, todo));
    var deleteLink = document.createElement("button");
    deleteLink.className = "destroy";
    deleteLink.addEventListener("click", deleteButtonPressed.bind(this, todo));
    var divDisplay = document.createElement("div");
    divDisplay.className = "showIt";
    /*divDisplay.appendChild(checkbox);*/
    divDisplay.appendChild(label);
    divDisplay.appendChild(deleteLink);
    var inputEditTodo = document.createElement("input");
    inputEditTodo.id = "input_" + todo._id;
    inputEditTodo.className = "edit";
    inputEditTodo.value = todo.title;
    inputEditTodo.addEventListener("keypress", todoKeyPressed.bind(this, todo));
    inputEditTodo.addEventListener("blur", todoBlurred.bind(this, todo));
    var li = document.createElement("li");
    li.id = "li_" + todo._id;
    li.appendChild(divDisplay);
    li.appendChild(inputEditTodo);
    if (todo.completed) {
      li.className += "complete";
      /*checkbox.checked = true;*/
    }
    return li;
  }
  function redrawTodosUI(todos) {
    var ul = document.getElementById("todo-list");
    ul.innerHTML = "";
    todos.forEach(function(todo) {
      ul.appendChild(createTodoListItem(todo.doc));
    });
  }
  function newTodoKeyPressHandler(event) {
    if (event.keyCode === ENTER_KEY) {
      addTodo(newTodoDom.value);
      newTodoDom.value = "";
    }
  }
  function addEventListeners() {
    newTodoDom.addEventListener("keypress", newTodoKeyPressHandler, false);
  }
  addEventListeners();
  showTodos();
  if (remoteCouch) {
    sync();
  }
})();
