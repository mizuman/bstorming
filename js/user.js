function User(){}

$(document).ready(function(){
	var APP_ID = "8DIsPS88JKgLxPJhh9zyt9TC5C03bMDs5il6r8fi";
	var JS_KEY = "RfsESAxLLE2ePcTfgydba0M8OrCyOqJpAGaYx9Ih";
	
	Parse.initialize(APP_ID, JS_KEY);

	function showVerigy() {
		$(".btn-verify").show();
		$(".btn-service").hide();
		// $("#username").removeAttr('disabled');
		// $("#password").removeAttr('disabled');
	}

	function showService() {
		$(".btn-verify").hide();
		$(".btn-service").show();
		// $("#username").attr('disabled', 'disabled');
		// $("#password").attr('disabled', 'disabled');
	}

	var userSignup = function(){
		var signup_user = new Parse.User();

		signup_user.set("username", $("#username").val());
		signup_user.set("password", $("#password").val());

		signup_user.signUp(null, {
			success: function(result_user){
				changeView('service');
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
				// showPic();
			},
			error: function(result_user, error) {
				alert("error");
			}
		});
	};

	var userLogout = function(){
		Parse.User.logOut();
		changeView('user-verify');
	};

	User.post = function(data){

		uploadFile(data.name, data);

	}

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
		// var _s = JSON.stringify(data);

		console.log(data,s);

		var sendData = window.btoa(unescape(encodeURIComponent(s)));
		// var sendData = data;
		// console.log(title,sendData);
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

		myPost.set({
			"Title": title,
			"url": url,
			"user": user
		});

		myPost.save(null,{
			success: function(){
				console.log("upload成功")
				User.getPost();
			}
		})
	}

	User.getPost = function(){
		var query = new Parse.Query("Post");
		var user = Parse.User.current().get("username");

		query.equalTo("user", user);
		query.ascending("root");
		query.find({
			success:function(results){
				showResults(results);
			}
		})
	}

	var showResults = function(results){
		// console.log(results);
		$(".load-map").remove();

		for(var i=0; i < results.length; i++){
			var entry = results[i];

			var title = entry.get("Title");
			var url = entry.get("url");

			// console.log("-----", title, url);

			var $item = $("<button>")
						.attr({
							type: 'button',
							class: "list-group-item load-map"
						})
						.text(title)
						.val(url)
						.on("click", function(event){
							TreeMap.loadMap($(this).val());
						})
						// .bind({map_title:title, map_url:url});

			$("#map-list").append($item);

			// $("#map-list").append()

			// d3.json(url, function(error, treeData){
			// 	console.log("hoge");
			// 	console.log(treeData);
			// })
		}
	}

	// var showPic = function(){
	// 	var query = new Parse.Query("Post");
	// 	var user = Parse.User.current().get("username");

	// 	query.equalTo("User", user);
	// 	query.ascending("updatedAt");
	// 	query.find({
	// 		success:function(results){
	// 			makeHtml(results);
	// 		}
	// 	});
	// }

	// var makeHtml = function(results){
	// 	// $("#display").append("hoge");
	// 	for(var i=0; i < results.length; i++){
	// 		var entry = results[i];

	// 		var title = entry.get("Title");
	// 		var image = entry.get("URL");
	// 		var comment = entry.get("Comment");
	// 		var user = entry.get("User");

	// 		var item = '<tr><th><img src="' + image + '"></th><th>' + user + '</th><th>' + title + '</th><th>' + comment + '</th></tr>';
	// 		// $("tbody").append(item);
	// 		$("tbody").prepend(item);

	// 	}
	// }

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

	if(Parse.User.current()){
		showService();
		User.getPost();
	} else {
		showVerigy();
	}
	
	$("#signup").on("click", function(event){
		// console.log("hoge");
		event.preventDefault()
		userSignup();
	})

	$("#login").on("click", function(event){
		event.preventDefault()
		userLogin();
	})

	$("#logout").on("click", function(event){
		event.preventDefault()
		userLogout();
	})

	$("#submit").on("click", function(event){
		event.preventDefault()
		upload_file();
	})

})
