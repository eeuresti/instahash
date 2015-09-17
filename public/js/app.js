$(document).ready(function() {

	$("input").focus();

	var tag = '';
	var min = '';
	var url = '';

	instagram = {
		clientID: "bbe475462f5645c4afa5405dd4165bc3",
		apiHost: "https://api.instagram.com"
	};

	function loadInstagramPhotos() {
		/*
				jc - at some point in this function, maybe
			 	consider removing any previous photos that
			 	you previous searched for.
		*/

		tag = $("input").val();
		/* jc - thank you for using AJAX :) */
		$.ajax({
			type: "GET",
			dataType: "jsonp",
			cache: false,
			url: instagram.apiHost + "/v1/tags/" + tag + "/media/recent/?client_id=" + instagram.clientID + "&count=15",
			data: {"client_id": instagram.clientID, "max_tag_id": min},
			success: function(pic) {
				/* jc - this is a great block of code, great work! */
				min = pic.pagination.next_max_tag_id;
				url = pic.pagination.next_url;
						for (var i = 0; i < pic.data.length; i++) { // data is the array we get back
							likes = pic.data[i].likes.count; //the number of likes for that picture (likes and count is from instagram)
							console.log(likes);
							link = pic.data[i].link;
							urlsrc = pic.data[i].images.thumbnail.url;
							$("#output").append("<div id='outputpic'><a target='_blank' href='" + link + "'><div id='stardiv'><div id='likesdiv'></div></div><img src='" + urlsrc + "'></img></div>");
						}
	        }
	    });
	}

	$("#morepictures").on("click", function() {
		loadInstagramPhotos();
	});
	//make a button on html to save search
	$("#savesearch").on("click", function() {
		console.log("Save this tag: " + tag);

		$.post("/saveSearch", {searchTerm: tag})
				 .done(function(res){
					 res.send(tag);
		});
	});

//display a list of previous searches

	/*
			jc - add the code here (line 63..67) to your loadInstagramPhotos
	 		function to clear out pics every time you search
	*/
	$("#clearpictures").on("click", function() {
		$("#output").empty();
		$("input").val('');
		$("input").focus();
	});

	$("input").on("click focusin", function() {
		this.value = '';
	});

	/* jc - i think you want showSearches for this AJAX request*/
	$.get("/saveSearch", function() {
		console.log("save sarches works!");
				// display a simple list of searchTerms
				var showSearches = res.reverse();
				console.log(searches);
				render(response.data);
	});

	/* jc - this is close, but you want to mix this with the above code block */
	$(".pastSearches").on("click", function(){
		window.location.href = "/saveSearch.html";
	});

});
