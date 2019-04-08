var apiKey = "8c86ed60197c61b5ca7df09c803f1dc8852261122d7c95c1ec939232f2066244"
var api = "https://api.kraigh.net/todos";

// data = {
//     text: WHATEVER THE TEXT IS,
//     completed: WHETHER IT IS COMPLETED OR NOT
// }

function handleAddEvent() {
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

}

function handleDeleteEvent() {
    
}

window.onload = function() {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200){
            // Convert response to JSON
            var todos = JSON.parse(this.responseText);

            for(var i = 0; i < todos.length; i++){
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

                document.getElementById("todo-list").append(listing);
                document.getElementById("todo-list").append(document.createElement("hr"));

                tempButton.addEventListener("click", handleDeleteEvent);
            }
        }
    }
    xhttp.open("GET", "https://api.kraigh.net/todos", true);
    xhttp.setRequestHeader("x-api-key", apiKey);
    xhttp.send();

}

document.getElementById("todo-btn").addEventListener("click", handleAddEvent);
