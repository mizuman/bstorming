var express = require("express")
var app = express()
var port = process.env.PORT || 5000
// var WebSocketServer = require("ws").Server
var http = require("http")
var server = http.createServer(app)

var io = require("socket.io")(server);

app.use(express.static(__dirname + "/"))

server.listen(port)

console.log("http server listening on %d", port)

// var wss = new WebSocketServer({server: server})
// console.log("websocket server created")

// wss.on("connection", function(ws) {
//   var id = setInterval(function() {
//     ws.send(JSON.stringify(new Date()), function() {  })
//   }, 1000)

//   console.log("websocket connection open")

//   ws.on("close", function() {
//     console.log("websocket connection close")
//     clearInterval(id)
//   })
// })

io.on("connection", function(socket){
	console.log("connected");

	socket.on("disconnect", function(){
		console.log("disconnected");
	})
})