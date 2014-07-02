var http = require('http');
var url = require('url');

function start(route,handle){
	function onRequest(request, response) {
		var postData = "";
		var pathname = url.parse(request.url).pathname;
		console.log('Request for ' + pathname + ' recieved!');
		
		request.setEncoding("utf8");	//设置接收数据的格式为UTF-8
		
		//POST请求所包含的数据量一般比较多，因为用户可能会输入大量的内容，因此必须采用非阻塞方式处理数据
		//在NodeJS中，会将POST数据拆分成很多小块，然后通过触发特定的事件将这些小块传递给回调函数
		//所以需要设计函数将这些小块拼接起来
		request.addListener("data",function(postDataChunk){
			postData += postDataChunk;
			console.log("Received Post data chunk: '" + postDataChunk +  "'.");
		})
		
		request.addListener("end",function(){
			route(handle,pathname,response,postData);
			console.log("Received Post data chunk: '" + postData +  "'.");
		})
			//将response作为参数传递到目标函数中以供调用，这样目标函数就不必为了使用response而引入整个模块了
		
		//response.writeHead(200, {'Content-Type': 'text/plain'});
		//response.end('Hello World\n');
	}
	http.createServer(onRequest).listen(1337, '127.0.0.1');
	console.log('Server running at http://127.0.0.1:1337/');
}

exports.start = start