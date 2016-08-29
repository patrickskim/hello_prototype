var Static = require('node-static');
var server = require('http').createServer
var file = new Static.Server('./build');

server(function (request, response) {
  request.addListener('end', function () {
    file.serve(request, response);
  }).resume();
}).listen(4001);
