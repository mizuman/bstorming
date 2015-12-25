function User(){}

$(document).ready(function(){

	function showVerigy() {
		$(".btn-verify").show();
		$(".btn-service").hide();
	}

	function showService() {
		$(".btn-verify").hide();
		$(".btn-service").show();
	}

	var userSignup = function(){
		var signup_user = new Parse.User();

		signup_user.set("username", $("#username").val());
		signup_user.set("password", $("#password").val());

		signup_user.signUp(null, {
			success: function(result_user){
				changeView('service');
				User.getPost();
			},
			error: function(result_user, error){
				alert("error" + error.message);
			}
		});
	};

	var userLogin = function(){

		var username = $("#username").val();
		var password = $("#password").val();

		Parse.User.logIn(username,password,{
			success: function(result_user) {
				changeView('service');
				User.getPost();
				chat.setUser(username);
			},
			error: function(result_user, error) {
				alert("error");
			}
		});
	};

	var userLogout = function(){
		Parse.User.logOut();
		changeView('user-verify');
		$(".load-map").remove();
		chat.setUser("guest");
	};

	User.post = function(data){

		uploadFile(data.name, data);

	};

	function uploadFile (title, data) {
		var memberfilter = [
			"name",
			"children",
			"_children",
			"depth",
			"x",
			"x0",
			"y",
			"y0"
			];
		var s = JSON.stringify(data, memberfilter, "\t");

		var sendData = window.btoa(unescape(encodeURIComponent(s)));
		var parseFile = new Parse.File("treedata.json", {base64: sendData});

		parseFile.save().then(function (uploadInfo){
			createPost(title, uploadInfo.url());
		} , function (err){
			console.log("file upload failed");
			console.log(err);
		})
	}

	function createPost (title, url){
		var Post = Parse.Object.extend("Post");
		var myPost = new Post();
		var user = Parse.User.current().get("username");
		var room = location.hash.substr(1);

		myPost.set({
			"Title": title,
			"url": url,
			"user": user,
			"room": room
		});

		myPost.save(null,{
			success: function(){
				console.log("upload成功")
				User.getPost();
			}
		})
	}

	User.getPost = function(type){
		if(typeof type == "undefined") type = "user";

		var query = new Parse.Query("Post");
		var user = Parse.User.current().get("username");
		var room = location.hash.substr(1);

		if(type=="user") {
			query.equalTo("user", user);
		} else if (type=="room") {
			query.equalTo("room", room);
		}

		
		// query.ascending("root");
		query.find({
			success:function(results){
				if(type=="user"){
					showResults(results, "reset");
					User.getPost("room");
				}
				if(type=="room"){
					showResults(results, "append");
				}
			}
		})
	};

	var showResults = function(results, reflesh){
		if(reflesh=="reset") {
			$(".load-map").remove();
		}

		var user = Parse.User.current().get("username");

		for(var i=0; i < results.length; i++){
			var entry = results[i];

			var title = entry.get("Title");
			var url = entry.get("url");
			var entryUser = entry.get("user");

			if(reflesh == "reset" || user !== entryUser){
				var $item = $("<button>")
							.attr({
								type: 'button',
								class: "list-group-item load-map " + reflesh + "-map"
							})
							.text(title)
							.val(url)
							.on("click", function(event){
								var url = $(this).val()
								var data = {
									url:url
								}
								chat.getMapData(data);
							});
				if(reflesh == "append"){
					$item.append(
								$("<span>")
								.attr('class', 'badge')
								.text(entryUser)
							);
				}

				$("#map-list").append($item);
			}
		}
	}

	var changeView = function(side){
		switch(side){
			case 'service':
				showService();
				break;
			case 'user-verify':
				showVerigy();
				break;
			default:
				console.log("page switch error");

				break;
		}
	}

	User.joinRoom = function(){
		var room, user, id;

		// set room
		if(location.hash){
			room = location.hash.substr(1);
		} else {
			room = "public";
		}

		// set user name
		if(Parse.User.current()){
			user = Parse.User.current().get("username");
			showService();
			User.getPost();
		} else {
			user = "guest";
		}

		id = Math.random().toString(36).slice(-8);

		chat(room, user);
		$("#comment").removeAttr('disabled');
	}

	function init() {
			showVerigy();
	}

	init();
	
	$("#signup").on("click", function(event){
		event.preventDefault();
		userSignup();
	});

	$("#login").on("click", function(event){
		event.preventDefault();
		userLogin();
	});

	$("#logout").on("click", function(event){
		event.preventDefault();
		userLogout();
	});

	$("#submit").on("click", function(event){
		event.preventDefault();
		upload_file();
	});

})
