window.onload = function(){
	var validateOnBlur = (function(){

		$('#someInput').on('blur',function(){
			$this = $(this);
			if(/^[0-9A-Za-z]{10}$/.test($this.val())){
				$this.nextAll('.oneplus-validate-tip').html('输入正确');
				$this[0].isValid = true;	//设置验证通过标志位
			}else{
				$this.nextAll('.oneplus-validate-tip').html('输入错误，请重新输入');
				$this[0].isValid = false;
			}
			return false; //阻止事件冒泡及默认行为
		});

	})();

	var validateBeforeSubmit = function(){
		if(!$('#someInput')[0].isValid){
			alert('input not valid');
			return false;
		}
	}

}