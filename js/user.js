function User(){};

$(document).ready(function(){
	var APP_ID = "8DIsPS88JKgLxPJhh9zyt9TC5C03bMDs5il6r8fi";
	var JS_KEY = "RfsESAxLLE2ePcTfgydba0M8OrCyOqJpAGaYx9Ih";
	
	Parse.initialize(APP_ID, JS_KEY);

	if(Parse.User.current.name){
		showService();
	} else {
		showVerigy();
	}

	function showVerigy() {
		$(".btn-verify").removeAttr('disabled');
		$(".btn-service").attr('disabled', 'disabled');
		$("#username").removeAttr('disabled');
		$("#password").removeAttr('disabled');
	};

	function showService() {
		$(".btn-verify").attr('disabled', 'disabled');
		$(".btn-service").removeAttr('disabled');
		$("#username").attr('disabled', 'disabled');
		$("#password").attr('disabled', 'disabled');
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

	// var upload_file = function(){
	// 	var fileUpload = $("#FileUpload")[0];
	// 	if (fileUpload.files.length > 0) {
	// 		var file = fileUpload.files[0];
	// 		var name = file.name;

	// 		var parseFile = new Parse.File(name, file);

	// 		parseFile.save().then(function(upload_info){
	// 			$("#FileUpload")[0].files[0]=undefined;
	// 			create_post(upload_info.url());
	// 		});
	// 	}
	// 	else alert("File isn't selected!");
	// }

	User.post = function(data){
		var Post = Parse.Object.extend("Post");
		var myPost = new Post();

		var title = data.name;
		var root = data;
		var user = Parse.User.current.name;

		myPost.set({
			"Title": title,
			"root": data,
			"user": user
		});

		myPost.save(null,{
			success: function(){
				console.log("upload成功")
			}
		})
	}

	// var create_post = function(data){
	// 	var Post = Parse.Object.extend("Post");
	// 	var myPost = new Post();

	// 	var title = $("#title").val();
	// 	var comment = $("#comment").val();
	// 	var user = Parse.User.current().get("username");

	// 	myPost.set("Title",title);
	// 	myPost.set("URL",upload_url);
	// 	myPost.set("Comment",comment);
	// 	myPost.set("User",user);

	// 	myPost.save(null,{
	// 		success: function(){
	// 			// showPic();
	// 			var temp  = $("#input_file").html();
	// 			$("#input_file").html(temp);
	// 			var item = '<tr><th><img src="' + upload_url + '"></th><th>' + user + '</th><th>' + title + '</th><th>' + comment + '</th></tr>';
	// 			// $("tbody").append(item);
	// 			$("tbody").prepend(item);
	// 		}
	// 	});
	// };

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
	
	$("#signup").on("click", function(event){
		console.log("hoge");
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
