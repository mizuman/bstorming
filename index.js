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

io.on("connection", function(socket){

	console.log("connected");
	socket.emit("connected", {name:"system", msg:"connected"});

	socket.on("msg", function(data){
		console.log(data);
	});

	socket.on("init", function(data){
		console.log(data);
		socket.join(data.room);
		socket.to(data.room).emit("init", data);
	});

	socket.on("welcome", function(data){
		console.log(data);
		socket.to(data.room).emit("welcome", data);
	})

	socket.on("system", function(data){
		console.log(data);
		socket.to(data.room).emit("system", data);
	});

	socket.on("comment", function(data){
		console.log(data);
		socket.to(data.room).emit("comment", data);
	});

	socket.on("disconnect", function(){
		console.log("disconnected");
	});
});