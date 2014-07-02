window.onload = function(){
	var submitBtn = document.getElementById('submit');
	submitBtn.onclick = function(){
		var username = document.getElementById('username');
		var password = document.getElementById('username');
		var reqData = {
			username: username.value,
			password: password.value
		}
		$.get('welcome',function(response){
			alert('back;')
		});
	}
}