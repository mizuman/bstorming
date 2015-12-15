var express = require("express");
var app = express();
var port = process.env.PORT || 5000;
// var WebSocketServer = require("ws").Server
var http = require("http");
var server = http.createServer(app);

var io = require("socket.io")(server);

app.use(express.static(__dirname + "/"));

server.listen(port);

console.log("http server listening on %d", port);

var chat = io.sockets.on("connection", function(client){
	console.log("connected");

	client.emit("news", {msg:"hello world"});

	client.on("msg", function(data){
		console.log(data);
	});

	client.on("comment", function(data){
		console.log(data);
	});

	client.on("disconnect", function(){
		console.log("disconnected");
	});
});