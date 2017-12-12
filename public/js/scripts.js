$(document).ready(function() {
	//scroll
	var scroll_start = 0;
   	var startchange = $('#ingredients');
   	var offset = startchange.offset();
    if (startchange.length){
   		$(document).scroll(function() { 
      		scroll_start = $(this).scrollTop();
      		if(scroll_start > offset.top - 110) {
         		 $("#contents").css('background-color', 'black');
         		 $(".recipe-toc").css('color', 'black');
     		} else {
          		$('#contents').css('background-color', 'transparent');
          		$(".recipe-toc").css('color', 'white');
       		}
 		 });
   	}

   	//menu dropdowns
	$('.dropbtn').hover(function () {
		$(this).find(".dropdown-content").css("display", "block");
		$(this).css({"border-bottom": "4px solid #b78e42", "cursor": "pointer", "color": "#b78e42"});
	}, function(){
   		 $(this).find(".dropdown-content").css("display", "none");
   		 $(this).css({"border-bottom": "none", "color": "white"});
	})

	$('#myBtn').click(function () {
		$('#myModal').css("display", "block");
	})
	$('.close').click(function () {
		$('#myModal').css("display", "none");
	})

	//add ingredients and directions
	var counter = 2;
	$("#add-ingredient").unbind().click( function() {
		var newIngredientField = $("<input type=\"text\" placeholder=\"1 cup ingredient\" name=\"ingredient\"><br>");
		$(".ingredients").append(newIngredientField);
	});
	$("#add-step").unbind().click( function() {
		var step = $("<input type=\"text\" placeholder=\"step\" name=\"step\" ><br>");
		var count = $("<span>").text(counter++ + " ");
		var stepAppend = count.add(step);
		$(".directions").append(stepAppend);
		count++;
	})
	var arr = [];
	$(".step").each(function(index) {
		arr[index] = $(this).attr('id');
	})
	var editcounter = parseInt(arr[arr.length - 1]) + 1;
	$("#edit-add-ingredient").unbind().click( function() {
		console.log(editcounter);
		var step = $("<input type=\"text\" placeholder=\"step\" name=\"step\" ><br>");
		var count = $("<span>").text(editcounter++ + " ");
		var stepAppend = count.add(step);
		$(".edit-directions").append(stepAppend);
		count++;
	});

})


function fade(el) {
	$(el).next().toggleClass('item-fade');
}

function fadeStep(el) {
	$(el).toggleClass('item-fade');
}

function closeModal() {
	$('.submitted-meal').css("display", "block");
}

function deleteMeal(el) {
	var next = $(el).next().html();
	var split = next.split(',');
	var recipe= $(el).next().next().html();
	$.ajax({
  		type: "POST",
  		url: '/deletemeal/' + split[0] + '/' + split[1],
 		data: recipe,
 		success: function(data){
     		console.log("Edited");
      		window.location.reload(); //this is the redirect
    	}
	});
}

function openDropdown(el) {
	var ts = localStorage.getItem("toggleState" +  $(el).html());
	console.log("toggleState" + "" + $(el).html());
	if (ts == null || ts == "0") {
		var tv = "1";
		localStorage.setItem("toggleState" + $(el).html(), tv);
	} else {
		var tv = "0";
		localStorage.setItem("toggleState" + $(el).html(), tv);	
	}
	$(el).parent().find(".dropdown-content").toggle();

}

function changeToRecipe(el, ejs) {
	var ejs = ejs;
	console.log(ejs)
	$(".viewport").load('/recipeview', ejs);
}

function showLogin(){
	zenscroll.toY(0);
	$(".form").load('/loginform');
}

function showRegister(){
	zenscroll.toY(0);
	$(".form").load('/registerform');
}

function uploadPic() {
	 $("#successful-upload").html("Image uploaded!");
}

function editTop(el, ejs) {
	var ejs = ejs;
	$("#top-section").load('/editTop', ejs);	
}

function editIngredients(el, ejs) {
	var ejs = ejs;
	$("#ingredients").load('/editIngredients', ejs);	
}

function editDirections(el, ejs) {
	var ejs = ejs;
	$("#directions").load('/editDirections', ejs);	
}

function editNotes(el, ejs) {
	var ejs = ejs;
	$("#notes").load('/editNotes', ejs);	
}

function editGallery(el, ejs) {
	var ejs = ejs;
	$("#gallery").load('/editGallery', ejs);	
}

function deleteRecipe(el, ejs) {
	 if (confirm("Are you sure you want to delete this recipe?") == true) {
	 	$.ajax({
  			type: "POST",
  			url: '/delete/' ,
  			async: false,
 			data: ejs,
 			success: function(data){
      			console.log("Edited");
      			window.location = '/deleted/'; //this is the redirect
    		}
		});
	 }
}
function addToGrocery(el) {
	$(el).attr('src', '/images/plus-grey.png');
	var item = $(el).next().html();
	 $.ajax({
  		type: "POST",
  		url: '/addgrocery' ,
 		data: item,
 		success: function(){
     		console.log("successfully added to grocery list")
    	}
	});
}

function clearGroceries() {
	 if (confirm("Are you sure you want to clear your grocery list?") == true) {
	 	$.ajax({
  			type: "POST",
  			url: '/cleargroceries/' ,
 			success: function(data){
      			console.log("Edited");
      			window.location.reload(); //this is the redirect
    		}
		});
	 }
}

function clearMeals() {
	 if (confirm("Are you sure you want to clear your meal planner?") == true) {
	 	$.ajax({
  			type: "POST",
  			url: '/clearmeals/' ,
 			success: function(data){
      			console.log("Edited");
      			window.location.reload(); //this is the redirect
    		}
		});
	 }
}

function reset_rating() {
    for (var i =1 ; i <= 5; i++) {
        $("#rate_image_"+i).attr("src", "/images/star.png"); 	
    }
}

function rate_images(rating) {
    if(!(rating>=1 && rating<=5)) return;
    for (var i = 5; i >= rating; i--) {
        $("#rate_image_"+i).attr("src", "/images/star.png"); 	
    }
    for(var i=1; i<=rating; i++) {
        $("#rate_image_"+i).attr("src", "/images/stargold.png");
    }

}

function rate(rating, id) {
	if(!(rating>=1 && rating<=5)) return;
    for (var i = 5; i >= rating; i--) {
        $("#rate_image_"+i).attr("src", "/images/star.png"); 	
    }
    for(var i=1; i<=rating; i++) {
        $("#rate_image_"+i).attr("src", "/images/stargold.png");
    }
	var rating = JSON.stringify(rating);
	var id = id;
    for(var i=1; i<=rating; i++) {
        $("#rate_image_"+i).attr("src", "/images/stargold.png");
    }	
	$.ajax({
  		type: "POST",
  		url: '/rate/' + id,
 		data: rating,
	});
}



