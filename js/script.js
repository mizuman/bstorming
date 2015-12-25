(function(){

	TreeMap();
	var userList = [];

	$("#comment").keypress(function(e){
		if(e.which==13){
			if($("#comment").val()){
				var msg = $("#comment").val();
				chat.sendComment({"msg": msg});
				$("#comment").val("");
			}
		}
	});

	var $createIdea = $(".workplace>div>input");

	$createIdea.keypress(function(e){
		if(e.which==13 && $createIdea.val()!==""){
			var $item = $("<button>")
						.attr({
							"class": 'list-group-item ideaCards',
							"type": "button"
						})
						.text($createIdea.val())
						.on("click", function(){
							if($(this).hasClass('list-group-item-info')){
								$(".list-group-item").removeClass("list-group-item-info");
							}
							else {
								$(".list-group-item").removeClass("list-group-item-info");
								$(this).addClass('list-group-item-info');
							}
						})
						.append($("<span>").attr({
								"class": 'glyphicon glyphicon-remove-circle'
							})
							.on("click", function(){
								$(this).parent().remove();
								$("#createCard").focus();
								chat.sendSysMsg({msg:"CardsNum", cardsNum: TreeMap.checkCardsNum()});
							})
						);
			$(".workplace-list").append($item);
			$createIdea.val("");
			chat.sendSysMsg({msg:"CardsNum", cardsNum: TreeMap.checkCardsNum()});
		}
	});

	$(".map-create").on("click", function(){
		var url = "/data/empty.json";
		var data = {
			msg: "loadMap",
			type: "system",
			url: url
		};
		chat.sendSysMsg(data);

		TreeMap.loadMap(url);
	});
	$(".map-JSON").on("click", function(){

		var memberfilter = ["name", "children", "_children"];
		var output = JSON.stringify(TreeMap.root, memberfilter, "\t");
		mySlidebars.slidebars.toggle("left");
		$(".modal-body").html("<pre><code>" + output + "</code></pre>");

	});
	$(".map-save").on("click", function(){
		console.log("map-save");
		var output = TreeMap.root;
		User.post(output);
	});
	$(".map-load").on("click", function(){
		User.getPost();
	});
	$("#rightMenuBtn").on("click", function(){
		$("#createCard").focus();

		// if left menu is open, need 300ms+ to focus
		if($(".sb-left").hasClass('sb-active')){
			setTimeout(function(){
				$("#createCard").focus();
			}, 500);
		}
	});

	function updateUserPresence(data){
		if(
			data.type=="welcome" || 
			data.type=="init" || 
			data.type=="system"
		) {
			addUserList(data);
		}
		if(data.type=="disconnected") {
			deleteUserList(data);
		}
	}

	function addUserList(data){
		var index;
		for(var i = 0, index = -1; i < userList.length; i++){
			if(userList[i].socketId == data.socketId){
				userList[i].cardsNum = data.cardsNum;
				index = i;
				$("#userview-"+data.socketId).text(data.user + "(" + data.cardsNum + ")");
			}
		}
		if(index == -1){
			userList.push({
				user: data.user,
				cardsNum: data.cardsNum,
				socketId: data.socketId
			});

			var $item = $("<span>")
							.attr({
								class: 'glyphicon glyphicon-user userlist',
								id: 'userview-'+data.socketId
							})
							.text(data.user + "(" + data.cardsNum + ")");
			$(".pager").append($item);
		}
	}

	function deleteUserList(data){
		$("#userview-"+data.socketId).remove();
	}

	function getMapFile(url){
		var data = {
			type: "getMapData",
			url: url
		};
		chat.send(data);
	}

	socket.on("connected" ,function(data){
		Parse.initialize(data.APP_ID, data.JS_KEY);
		User.joinRoom();

		var _data = {
			cardsNum: TreeMap.checkCardsNum()
		};
		chat.sendInit(_data);
	});

	socket.on("init", function(data){
		var _data = {
			type: "welcome",
			to: data.socketId,
			cardsNum: TreeMap.checkCardsNum()
		};
		chat.send(_data);
		updateUserPresence(data);
	});

	socket.on("welcome", function(data){
		console.log(data);
		if(userList.length==0){
			var _data = {
				type: "mapRequest",
				to: data.socketId,
				cardsNum: TreeMap.checkCardsNum()
			};
			chat.send(_data);
		}
		updateUserPresence(data);
	});

	socket.on("mapRequest", function(data){
		console.log(data);
		var memberfilter = ["name", "children", "_children", "x", "x0", "y", "y0"];
		var _data = {
			type: "mapResponse",
			to: data.socketId,
			map: JSON.stringify(TreeMap.root, memberfilter, "\t"),
			cardsNum: TreeMap.checkCardsNum()
		};
		console.log("_data",_data);
		chat.send(_data);
	});

	socket.on("mapResponse", function(data){
		console.log(data);
		// TreeMap.root = data.map;
		TreeMap.update(JSON.parse(data.map));
	});

	socket.on("comment", function(data){
		console.log(data);
	});

	socket.on("system", function(data){
		console.log(data);
		if(data.msg == "CardsNum"){
			updateUserPresence(data);
		}
		else if(data.msg == "editNodeName"){
			var targetNode = TreeMap.pickUpNodeByPath(data.path, TreeMap.root);
			TreeMap.changeName(targetNode,data.nodeName);
		} else if(data.msg == "deleteNode"){
			var targetNode = TreeMap.pickUpNodeByPath(data.path, TreeMap.root);
			TreeMap.deleteNode(targetNode);
		} else if(data.msg == "loadMap"){
			TreeMap.loadMap(data.url);
		} else if(data.msg == "addNode"){
			data.addNode = JSON.parse(data.addNode);
			console.log("addNode mesg received", data);
			TreeMap.addNode(data);
		} else if(data.msg == "moveNode"){
			console.log(data);
			TreeMap.moveNode(data);
		}
	});

	socket.on("disconnected", function(data){
		updateUserPresence(data);
	});

})();

// slidebars
(function($) {
	$(document).ready(function() {
	mySlidebars = new $.slidebars({
		siteClose: false
	});
	mySlidebars.slidebars.open("left");
	});
})(jQuery);