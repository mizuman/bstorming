// var socket = io();

// socket.on('connect', function(){
//     console.log("connected");
// });

// var socket = io.connect("http://localhost:5000");
var socket;
if(location.hostname=="localhost"){
	socket = io.connect("http://localhost:5000");
} else {
	socket = io.connect("/");
}

function chat(room, name){

	socket.on("connected" ,function(){
		console.log("init msg from client to server");
		socket.emit("init", {"room": room, "name": name});
	});

	socket.on("comment", function(data){
		console.log("get comment");
		console.log(data);
	});

	socket.on("system", function(data){
		console.log(data);

	});
}

(function(){
	var room, name;
	if(location.hash) {
		room = location.hash.substr(1);
	} else {
		room = "public";
	}

	if($("#myid").val()) {
		name = $("#myid").val();
	} else {
		name = Math.random().toString(36).slice(-8);
	}

	chat(room,name);

	$("#comment").keypress(function(e){
		if(e.which==13){
			if($("#comment").val()){
				var msg = $("#comment").val();
				console.log(msg);
				socket.json.emit("comment", {"room": room, "name": name, "msg": msg});
				$("#comment").val("");
			}
		}
	});
})();