$(function(){
	var textAnimation = function(){
		this.display();
		//this.quit();
	}

	textAnimation.prototype = {
		$text: $('#titleText').find('p'),
		$container: $('#titleText').parent(),
		display: function(){
			var delayTime = 3000;
			this.$text.each(function(index){
				$(this).delay(index*delayTime).slideDown(delayTime);
			});
			this.$text.parent().delay(delayTime * this.$text.length+4000).fadeOut(2000,null,this.$container.slideUp);
		}
	}

	new textAnimation;
})