function route(handle,pathname,response,postData){
	console.log('About to route a request for ' + pathname);
	
	if(typeof handle[pathname] === "function"){
		handle[pathname](response,postData);
	}else{
		console.log("No request handler was found!")
		response.writeHead(404, {'Content-Type': 'text/plain'});
		response.write('404 Not Found!')
		response.end('Hello World\n');
	}
}

exports.route = route;