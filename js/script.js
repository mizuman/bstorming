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
			$(".workplace-list").prepend($item);
			$createIdea.val("");
			chat.sendSysMsg({msg:"CardsNum", cardsNum: TreeMap.checkCardsNum()});
		}
	});

	$(".map-create").on("click", function(){
		var url = "/data/empty.json";
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
			data.type=="system" ||
			data.type=="CardsNum"
		) {
			addUserList(data);
		}
		if(data.type=="disconnected") deleteUserList(data);
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

	socket.on("connected" ,function(){
		var data = {
			cardsNum: TreeMap.checkCardsNum()
		};
		chat.sendInit(data);
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
		updateUserPresence(data);
	});

	socket.on("comment", function(data){
		console.log(data);
	});

	socket.on("system", function(data){
		console.log(data);
		updateUserPresence(data);
	});

	socket.on("disconnected", function(data){
		updateUserPresence(data);
	})

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