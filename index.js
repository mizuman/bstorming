var express = require("express");
var app = express();
var port = process.env.PORT || 5000;
// var WebSocketServer = require("ws").Server
var http = require("http");
var server = http.createServer(app);

var io = require("socket.io")(server);
var Parse = require('parse/node').Parse;

var APP_ID = process.env.NODE_PARSE_APP_ID;
var JS_KEY = process.env.NODE_PARSE_JS_KEY;


Parse.initialize(APP_ID, JS_KEY);

app.use(express.static(__dirname + "/"));

server.listen(port);

console.log("http server listening on %d", port);

io.on("connection", function(socket){

	var room;

	console.log("connected");
	socket.emit("connected", {name:"system", type:"connected", APP_ID:APP_ID, JS_KEY:JS_KEY});

	function getMapFilebyParse(data){
		http.get(data.url, function(res){
			var body = '';
			res.setEncoding('utf8');

			res.on('data', function(chunk){
				body += chunk;
			});

			res.on('end', function(res){
				ret = JSON.parse(body);
				data.map = ret;
				sendMapFile(data);
			});
		}).on('error', function(e){
			console.log(e.message); //エラー時
		});
	}

	function sendMapFile(data){
		socket.emit("getMapFile", data);
		socket.to(data.room).emit("getMapFile", data);
	}

	function checkURLforParse(url){
		var domain = url.match(/^[httpsfile]+:\/{2,3}([0-9a-z\.\-:]+?):?[0-9]*?\//i)[1];
		if(domain=="files.parsetfss.com") {
			return true;
		} else {
			return false;
		}
	}

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
		socket.to(data.to).emit("mapRequest", data);
	});

	socket.on("mapResponse", function(data){
		socket.to(data.to).emit("mapResponse", data);
	});

	socket.on("getMapFile", function(data){
		if(checkURLforParse(data.url)) getMapFilebyParse(data);
	});

	socket.on("system", function(data){
		socket.to(data.room).emit("system", data);
	});

	socket.on("comment", function(data){
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