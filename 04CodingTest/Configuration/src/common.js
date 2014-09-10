var common = (function(){

	var popWin = {
		mask: '<div class="pop-mask"><img src="img/loading.gif"></div>',
		show: function(){
			$(document.body).append(this.mask);
		},
		hide: function(){
			$('.pop-mask').remove();	
		}
	};

	return {
		pop: popWin

	};
})()

$(function(){
	
	$('#xxxx').datagrid({onSelect:function(a,b,c){
		alert('xxxxxxxxxxxxxxx');
	}});

	
});

function xxx(value,rec,index){
	
}

function abc(that){
	$('#xxxx').data().eventTrigger = that;
}
	
