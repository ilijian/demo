var fs = require('fs');

function start(response, postData){
	console.log('Request handler "start" was called');
	fs.readFile('E:/01PersonalBelongings/04CodingTest/BackboneTable/index.html', function (err, data) {
	  	if (err) throw err;
	  	response.writeHead(200, {'Content-Type': 'text/html'});
		response.write(data);
		response.end();
	});

}

function create(response, postData){
	console.log('Request handler "create" was called');
	response.setHeader('Access-Control-Allow-Origin', '*');	//允许跨域
	response.writeHead(200, {'Content-Type': 'text/plain'});
	//'{"selected":false,"id":null,"name":"xxxxxx","sex":"M","address":"xxxxx","career":"xxxxx","phone":"xxxxx"}'
	var responseData = JSON.parse(postData) ;
	if(!responseData.id){
		responseData.id = Math.random()*1e18;
	}
	response.write(JSON.stringify(responseData));
	response.end();
}

function destroy(response,postData){
	console.log('Request handler "destroy" was called');
	
	response.writeHead(200, {'Content-Type': 'text/plain'});
	//'{"selected":false,"id":null,"name":"xxxxxx","sex":"M","address":"xxxxx","career":"xxxxx","phone":"xxxxx"}'
	response.write("{id:'0'}");
	response.end();
}

exports.start = start;
exports.create = create;
exports.destroy = destroy;