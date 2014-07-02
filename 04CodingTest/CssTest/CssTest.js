require.config({
	paths: {
		"jquery": "../../05lib/JS/jquery1.11.1",
		"underscore": "../../05lib/JS/underscore",
		"backbone": "../../05lib/JS/backbone",
		"bootstrap": "../../05lib/UI/bootstrap-3.0.3/dist/js/bootstrap_altered"
	},
	shim: {	//解决bootstrap与jquery的不兼容
        'bootstrap': { 
            deps:['jquery']
        }
    }
});

define(["jquery","underscore","backbone","bootstrap"],function($,_,Backbone){
	$('.demo-form').bind('change',function(){
		alert('changed');
		
	})

});

function loadScript(url,callback){
	var script = document.createElement("script");
	script.type = "text/javascript";
	if(script.readyState){
		script.onreadystatechange = function(){
			if(script.readyState==="loaded" || script.readyState === "complete"){
				script.onreadystatechange = null;
				callback();
			}
		}
	}else{
		script.onload = function(){
			callback();
		}
	}
	
	script.src = url;
	document.getElementsByTagName("head")[0].appendChild(script);
}