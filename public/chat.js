var HOST = location.origin.replace(/^http/, 'ws')
var socket = new WebSocket('ws://127.0.0.1:8080');
socket.onopen = function(e) {
    console.log("connection established");
}

$(document).ready(function(){
    document.getElementById("tablehead").onclick = () => {
        socket.send("hello");
        alert("hello sent")
    }

    $("#sendbtn").click(() => {
        socket.send($('#ChatBox').val());
    })
})

socket.onmessage = function(e) {
    var recievedData = e.data;
    $(".tablebody" )
    .append(
        $('<tr/>')
        .attr("id", "newDiv1")
        .addClass("newClass")
        .append(
            $('<td/>')
            .attr("id", "newDiv2")
            .addClass("newClass")
            .text("user")
        )
        .append(
            $('<td/>')
            .attr("id", "newDiv2")
            .addClass("label lable-default")
            .text(recievedData)
        )
    );
}

