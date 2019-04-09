var apiKey = "8c86ed60197c61b5ca7df09c803f1dc8852261122d7c95c1ec939232f2066244"
var api = "https://api.kraigh.net/todos";

// Global variable to hold all the ToDo items once gotten initially
var ToDos;

function handleAddEvent() {
    if (document.getElementById("todo-task-input").value === null || document.getElementById("todo-task-input").value === "") {
        alert("Please input an event");
    } else {
        // If the value of input was not null or "" then take the input and add 
        // the inputted string into the database of the API
        var xhttp = new XMLHttpRequest();
        var newTodo = document.getElementById("todo-task-input").value;

        var data = {
            text: newTodo
        };

        xhttp.open("POST", "https://api.kraigh.net/todos", false);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.setRequestHeader("x-api-key", apiKey);
        xhttp.send(JSON.stringify(data));

        xhttp.onreadystatechange = function () {

            if (this.readyState == 4 && this.status == 200) {
                var todo = JSON.parse(this.responseText);
                console.log(todo);
            } else if (this.readyState == 4) {
                console.log(this.responseText);
            }
        };

        document.getElementById("todo-task-input").value = "";
        renderToDo();
    }
}

// Handle Deletes by sending request to API and then calling the renderToDo function
function handleDeleteEvent() {
    var api_id = event.target.getAttribute("api_id");
    console.log(api_id);
    var xhttp = new XMLHttpRequest();

    // Request to API to delete the item
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            renderToDo();
        }
    }

    xhttp.open("DELETE", "https://api.kraigh.net/todos/" + api_id, true);
    xhttp.setRequestHeader("x-api-key", apiKey);
    xhttp.send();
}

// Handle Completed Events by sending request to API and then calling the renderToDo function
function handleCompleteEvent() {
    var api_id = event.target.getAttribute("api_id");
    var completedChange;

    // Iterate through all To Do items already on the page
    // Then check for the one with the same id that were looking for
    // set completed variable to negation of the already set value
    for(var j = 0; j < ToDos.length; j++){
        if(api_id === ToDos[j].id){
            completedChange = !ToDos[j].completed;
            break;
        }
    }

    var xhttp = new XMLHttpRequest();

    var data  = {
        completed: completedChange
    };

    // Send the request to API
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            renderToDo();
        }
    }
    xhttp.open("PUT", "https://api.kraigh.net/todos/" + api_id, true);
    xhttp.setRequestHeader("x-api-key", apiKey);
    xhttp.send(JSON.stringify(data));
}

// renderToDo is called when loaded and then whenever getting all the To Do items
function renderToDo() {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("todo-list").innerHTML = "";
            // Convert response to JSON
            var todos = JSON.parse(this.responseText);
            ToDos = todos;

            todos = todos.sort(function (a, b) {
                return a.created - b.created;
            });
            console.log(todos);

            // Goes through all of the response variables and creates the elements on the page
            for (var i = 0; i < todos.length; i++) {
                var listing = document.createElement("div");

                // Create the element for text
                var tempElement = document.createElement("p");
                tempElement.innerText = todos[i].text;
                tempElement.setAttribute("id", todos[i].text);
                tempElement.setAttribute("api_id", todos[i].id);

                // Create the element for the Delete button
                var tempButton = document.createElement("button");
                tempButton.innerText = "Delete";
                tempButton.setAttribute("id", todos[i].text);
                tempButton.setAttribute("api_id", todos[i].id);

                // Create the element for the Completed button
                var tempCheckbox = document.createElement("button");
                tempCheckbox.innerText = "Completed";
                tempCheckbox.setAttribute("id", todos[i].text);
                tempCheckbox.setAttribute("api_id", todos[i].id);
                
                // Append all the created elements to one div per To Do item
                listing.append(tempElement);
                listing.append(tempButton);
                listing.append(tempCheckbox);
                listing.append(document.createElement("hr"));

                // Add To Do item to the page and add event listeners
                document.getElementById("todo-list").append(listing);
                tempButton.addEventListener("click", handleDeleteEvent);
                tempCheckbox.addEventListener("click", handleCompleteEvent);

                // Handles the different cases of completed or not completed
                if(todos[i].completed === true){
                    tempElement.setAttribute("class", "complete");
                } else {
                    tempElement.setAttribute("class", "incomplete");
                }
            }
        }
    }
    xhttp.open("GET", "https://api.kraigh.net/todos", true);
    xhttp.setRequestHeader("x-api-key", apiKey);
    xhttp.send();
}

function handleEnter(){
    if(event.which === 13){
        handleAddEvent();
    }
}

document.getElementById("todo-btn").addEventListener("click", handleAddEvent);
document.addEventListener("keydown", handleEnter);

renderToDo();