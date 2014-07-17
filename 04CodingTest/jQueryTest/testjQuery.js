
function moveElement(element,final_x,final_y,interval){
	element.style.position = element.style.position || "relative";
	
	var start_x = parseInt(element.style.left) || 0; 
	var start_y = parseInt(element.style.top) || 0;
	
	if(final_x<= start_x && final_y <= start_y){
		return;
	}
	
	if(start_x<final_x){
		start_x++;
		element.style.left = start_x + "px";
	}
	
	if(start_y < final_y){
		start_y++;
		element.style.top = start_y + "px";
	}
	
	var move = setTimeout("moveElement(animation,100,200,10)",interval);
	
}

window.onload = function(){
	var countdownDisplay = document.getElementById('animation');

	//setTimeout(function(){countdown(countdownDisplay,100)},500);
	//setTimeout(function(){alert('aaaa')},5000);
	setTimeout("pp()",2000);
}

function countdown(element, startNum){
	element.childNodes[0].nodeValue = startNum;
	startNum--;
	if(startNum <= 0){
		return;
	}
	setTimeout(function(){countdown(element,startNum)},500);
}

function pp(){
	console.log("beautiful");
}
//表单输入的通常处理




