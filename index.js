var express = require("express");
var app = express();
var port = process.env.PORT || 5000;
// var WebSocketServer = require("ws").Server
var http = require("http");
var server = http.createServer(app);

var io = require("socket.io")(server);
var Parse = require('parse/node').Parse;

var APP_ID = "8DIsPS88JKgLxPJhh9zyt9TC5C03bMDs5il6r8fi";
var JS_KEY = "RfsESAxLLE2ePcTfgydba0M8OrCyOqJpAGaYx9Ih";


Parse.initialize(APP_ID, JS_KEY);

app.use(express.static(__dirname + "/"));

server.listen(port);

console.log("http server listening on %d", port);

io.on("connection", function(socket){

	var room;

	console.log("connected");
	socket.emit("connected", {name:"system", msg:"connected", APP_ID:APP_ID, JS_KEY:JS_KEY});

	function getMapFilebyParse(url){
		console.log(url);
		http.get(url, function(res){
			var body = '';
			res.setEncoding('utf8');

			res.on('data', function(chunk){
				body += chunk;
			});

			res.on('end', function(res){
				ret = JSON.parse(body);
				console.log(ret);
			});
		}).on('error', function(e){
			console.log(e.message); //エラー時
		});
	}

	socket.on("msg", function(data){
		console.log(data);
	});

	socket.on("init", function(data){
		console.log(data);
		room = data.room;
		socket.join(data.room);
		socket.to(data.room).emit("init", data);
	});

	socket.on("welcome", function(data){
		console.log(data);
		socket.to(data.to).emit("welcome", data);
	});

	socket.on("mapRequest", function(data){
		console.log(data);
		socket.to(data.to).emit("mapRequest", data);
	});

	socket.on("mapResponse", function(data){
		console.log(data);
		socket.to(data.to).emit("mapResponse", data);
	});

	socket.on("getMapFile", function(data){
		console.log(data);
		getMapFilebyParse(data.url);
	});

	// socket.on("getKeys", function(data{
	// 	console.log(data);
	// 	data.APP_ID = APP_ID;
	// 	data.JS_KEY = JS_KEY;
	// 	socket.to(data.socketId).emit("yourkeys", data);
	// }))

	socket.on("system", function(data){
		console.log(data);
		socket.to(data.room).emit("system", data);
	});

	socket.on("comment", function(data){
		console.log(data);
		socket.to(data.room).emit("comment", data);
	});

	socket.on("disconnect", function(){
		var data = {
			type: "disconnected",
			socketId: socket.id
		};
		socket.to(room).emit("disconnected", data);
	});
});