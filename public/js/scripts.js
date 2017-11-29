$(document).ready(function() {
	if (localStorage.getItem("toggleStateCookies") == "1") {
		$(".dropdown-cookies").find(".dropdown-content").show();
	}
	if (localStorage.getItem("toggleStateCakes") == "1") {
		$(".dropdown-cakes").find(".dropdown-content").show();
	}
	if (localStorage.getItem("toggleStateBreads") == "1") {
		$(".dropdown-breads").find(".dropdown-content").show();
	}
	if (localStorage.getItem("toggleStatePies") == "1") {
		$(".dropdown-pies").find(".dropdown-content").show();
	}
	//add ingredients 
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
	console.log(ejs)
	$("#top-section").load('/editTop', ejs);	
}

function editIngredients(el, ejs) {
	var ejs = ejs;
	console.log(ejs)
	$("#ingredients").load('/editIngredients', ejs);	
}

function editDirections(el, ejs) {
	var ejs = ejs;
	console.log(ejs)
	$("#directions").load('/editDirections', ejs);	
}

function editGallery(el, ejs) {
	var ejs = ejs;
	console.log(ejs)
	$("#gallery").load('/editGallery', ejs);	
}
