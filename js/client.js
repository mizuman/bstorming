var socket;
if(location.hostname=="localhost"){
	socket = io.connect("http://localhost:5000");
} else {
	socket = io.connect("/");
}

function chat(room, user){

	socket.on("connected" ,function(){
		console.log("init msg from client to server");
		chat.sendInit();
	});

	socket.on("init", function(data){
		console.log(data);
		var _data = {
			type: "welcome",
			cardsNum: TreeMap.checkCardsNum()
		};
		chat.send(_data);
	});

	socket.on("welcome", function(data){
		console.log(data);
	})

	socket.on("comment", function(data){
		console.log("get comment");
		console.log(data);
	});

	socket.on("system", function(data){
		console.log(data);

	});

	chat.setUser = function(_user){
		user = _user;
	};

	chat.checkUser = function(){
		return user;
	};

	chat.send = function(data){
		if(typeof data == "undefined") data = {type: "undefined"};
		data.room = room;
		data.user = user;
		data.socketId = socket.id;
		socket.emit(data.type, data);
	};

	chat.sendInit = function(){
		var data = {};
		data.type = "init";
		chat.send(data);
	};

	chat.sendSysMsg = function(data){
		data.type = "system";
		chat.send(data);
	};

	chat.sendComment = function(data){
		data.type = "comment";
		chat.send(data);
	};

}