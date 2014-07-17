window.onload = function(){

	var someSection = {
		regExp: /^[0-9A-Za-z]{10}$/,
		validateOnBlur: function(){

			$('#someInput').on('blur',function(){
				$this = $(this);
				if(this.regExp.test($this.val())){
					$this.nextAll('.oneplus-validate-tip').html('输入正确');
					$this[0].isValid = true;	//设置验证通过标志位
				}else{
					$this.nextAll('.oneplus-validate-tip').html('输入错误，请重新输入');
					$this[0].isValid = false;
				}
				return false; //阻止事件冒泡及默认行为
			});

		},
		onBtnClick: function(){
			var $button = $('#someButton');
			
			$button[0].countDown = function(){
	    		$button.attr('disabled','disabled');
	    		var secs = $button[0].secs;
				if(secs<=0){
					//clearTimeout($this[0].count);
					$button.removeAttr('disabled');	
					$button.text('获取验证码');
					return false;
				}

				$button.text(secs + '秒后重试');
				$button[0].secs--;
				setTimeout($button[0].countDown,1000);
			};

			$button.on('click',function(){
				this.secs = 10;
				this.countDown();
			})
		},
		validateBeforeSubmit: function(){
			if(!$('#someInput')[0].isValid){
				//alert('input not valid');
				return false;
			}
		}
	}
	someSection.validateOnBlur();
	someSection.onBtnClick();
	someSection.validateBeforeSubmit();
}