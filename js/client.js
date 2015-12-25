var socket;
if(location.hostname=="localhost"){
	socket = io.connect("http://localhost:5000");
} else {
	socket = io.connect("/");
}

function chat(room, user){

	chat.setUser = function(_user){
		user = _user;
		var data = {
			type: "system",
			cardsNum: TreeMap.checkCardsNum()
		};
		chat.send(data);
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

	chat.sendInit = function(data){
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

	chat.getKeys = function(){
		var data = {
			type: "getKeys"
		}
		chat.send(data);

	}

}