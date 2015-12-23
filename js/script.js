(function(){

	TreeMap();

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
								"class": 'badge'
							})
							.text("x")
							.on("click", function(){
								$(this).parent().remove();
								$("#createCard").focus();
								chat.sendSysMsg({msg:"CardsNum", CardsNum: TreeMap.checkCardsNum()});
							})
						);
			$(".workplace-list").prepend($item);
			$createIdea.val("");
			chat.sendSysMsg({msg:"CardsNum", CardsNum: TreeMap.checkCardsNum()});
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