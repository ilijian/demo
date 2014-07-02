var server = require('./server');
var router = require('./router');
var requestHandlers = require('./requestHandlers');

var handle = {}
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/create"] = requestHandlers.create;
handle["/destroy"] = requestHandlers.destroy;

server.start(router.route,handle);