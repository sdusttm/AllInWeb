var socket = new WebSocket("ws://localhost:8181")
socket.onopen = function(e) {
    console.log("connection established");
}

$(document).ready(function(){
    document.getElementById("tablehead").onclick = function() {
        socket.send("hello");
        alert("hello sent")
    }
})