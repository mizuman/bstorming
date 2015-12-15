var socket = io();

socket.on('connect', function(){
    console.log("connected");
});

var socket = io.connect("/");

function chat(room, name){
	console.log("chat---" + room + name);
	socket.on("connected" ,function(){
		socket.json.emit("init", {"room": room, "name": name});
	});

	socket.on("message", function(data){
		if(data){
			update(data);
		}
	});

	socket.on("news", function(data){
		console.log(data);
	})
}

function send(name) {
	var data = $("#comment").val();
	socket.json.send(data);
	$("#comment").val("");
}

function update(data) {
	// var $obj = $("<div>").text(data);
	// $("#view").append($obj);
	console.log(data);
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
			}
		}
	});
})();