//JS框架
var simplifiedjs = simplifiedjs || {};
simplifiedjs = (function(){
	//常用的函数
	Function.prototype.extend = function(Parent){
		if(Parent instanceof Function){
			this.prototype = new Parent;
		}
		return this;
	}

	function isNumber(value){
		return typeof value === 'number' && isFinite(value);
	}

	function loadScript(url,callback){
		var script = document.createElement("script");
		script.type = "text/javascript";
		
		if(script.readyState){	//for ie
			script.onreadystatechange = function(){
				if(script.readyState==="loaded" || script.readyState === "complete"){
					script.onreadystatechange = null;
					callback();
				}
			}
		}else{	//for other browsers
			script.onload = function(){
				callback();
			}
		}
		
		script.src = url;
		document.getElementsByTagName("head")[0].appendChild(script);
	}

	String.prototype.trim = String.prototype.trim || function(){
		if(!this) return this;
		return this.replace(/^\s+|\s\s*$/g,"");
	}
	
	Element.prototype.insertAfter = function(newElement, targetElement){
		
		if(this.lastChild === targetElement){
			this.appendChild(newElement);
		}else{
			this.insertBefore(newElement,targetElement.nextSibling);
		}
	}
})();

