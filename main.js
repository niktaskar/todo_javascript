var apiKey = "8c86ed60197c61b5ca7df09c803f1dc8852261122d7c95c1ec939232f2066244"
var api = "https://api.kraigh.net/todos";

// data = {
//     text: WHATEVER THE TEXT IS,
//     completed: WHETHER IT IS COMPLETED OR NOT
// }

function handleAddEvent() {
    if (document.getElementById("todo-task-input") == null) {
        alert("Please input an event");
    } else {
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

        // THIS RELOADS THE PAGE AT THE END OF THE AJAX REQUEST
        // THIS IS AFTER UPDATING THE API
        location.reload();
    }
}

function handleDeleteEvent() {
    var api_id = event.target.getAttribute("api_id");
    console.log(api_id);
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // console.log(this.responseText);

            // THIS RELOADS THE PAGE AT THE END OF THE AJAX REQUEST
            // THIS IS AFTER UPDATING THE API
            location.reload();
        }
    }

    xhttp.open("DELETE", "https://api.kraigh.net/todos/" + api_id, true);
    xhttp.setRequestHeader("x-api-key", apiKey);
    xhttp.send();


}

// THIS CODE IS CALLED ON PAGE RELOAD
// IT ACCESSES THE API AND RENDERS ALL TODO EVENTS BEING HELD
window.onload = function () {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // Convert response to JSON
            var todos = JSON.parse(this.responseText);

            todos = todos.sort(function (a, b) {
                return a.created - b.created;
            });
            console.log(todos);

            for (var i = 0; i < todos.length; i++) {
                var listing = document.createElement("div");

                var tempElement = document.createElement("p");
                tempElement.innerText = todos[i].text;
                tempElement.setAttribute("id", todos[i].text);
                tempElement.setAttribute("api_id", todos[i].id);

                var tempButton = document.createElement("button");
                tempButton.innerText = "Delete";
                tempButton.setAttribute("id", todos[i].text);
                tempButton.setAttribute("api_id", todos[i].id);

                listing.append(tempElement);
                listing.append(tempButton);
                listing.append(document.createElement("hr"));

                document.getElementById("todo-list").append(listing);
                tempButton.addEventListener("click", handleDeleteEvent);
            }
        }
    }
    xhttp.open("GET", "https://api.kraigh.net/todos", true);
    xhttp.setRequestHeader("x-api-key", apiKey);
    xhttp.send();

}

document.getElementById("todo-btn").addEventListener("click", handleAddEvent);

