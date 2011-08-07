/* Author: 

*/


//TODO: put this in some kind of module -- global object is fine for now
var wsUri = "ws://173.45.228.42:8787/";

var output;
var clients;

function init() {

    output = document.getElementById("chatLog");
    testWebSocket();
}

function testWebSocket() {
    websocket = new WebSocket(wsUri);
    websocket.onopen = function(evt) {
        onOpen(evt)
    };

    websocket.onclose = function(evt) {
        onClose(evt)
    };

    websocket.onmessage = function(evt) {
        onMessage(evt)
    };

    websocket.onerror = function(evt) {
        onError(evt)
    };

}

function onOpen(evt) {
    writeToScreen("CONNECTED");
    doSend(JSON.stringify({
        "type": "login",
        "ns": "org.jWebSocket.plugins.system",
        "username": "guest1",
        "password": "guest1"
    }));

    doSend(JSON.stringify({
        "type": "getClients",
        "ns": "org.jWebSocket.plugins.system",
        "mode": "0"
    }));
}

function onClose(evt) {
    writeToScreen("DISCONNECTED");
}

function onMessage(evt) {
    writeToScreen('<span style="color: blue;">RESPONSE: ' + evt.data + '</span>');
    decodeMessage(evt.data);
//websocket.close();
}

function onError(evt) {
    writeToScreen('<span style="color: red;">ERROR:</span> ' + evt.data);
}

function createCoordMessage(x1,y1,x2,y2){
    doSend(JSON.stringify({
        "type": "broadcast",
        "ns": "org.jWebSocket.plugins.system",
        "data": {
            "x1":x1,
            "y1":y1,
            "x2":x2,
            "y2":y2
        }
    }));
}

function doSend(message) {
    websocket.send(message);
}

function writeToScreen(message) {
    var pre = document.createElement("p");
    pre.style.wordWrap = "break-word";
    pre.innerHTML = message;
    output.appendChild(pre);
}

function sendMessage() {

    doSend(JSON.stringify({
        "type": "broadcast",
        "ns": "org.jWebSocket.plugins.system",
        "data": "WebSocket are not too bad!",
        "senderIncluded" : "true"
    }));

}

function decodeMessage(message) {
    var a = JSON.parse(message);    
    //var lastPos = clients[a.sourceId];
    //clients[a.sourceId] = a.data;
    //writeToScreen(a.data.x);
    //writeToScreen(a.data.y);
    if (a.data !== undefined){
        draw(a.data.x1, a.data.y1, a.data.x2, a.data.y2);
    }
};

window.addEventListener("load", init, false);
