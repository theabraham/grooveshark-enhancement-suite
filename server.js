var PORT = 4000;
var http = require('http');
var url = require('url');
var fs = require('fs');

var server = http.createServer(function(req, res) {
    var path = url.parse(req.url).pathname;
    var mode = 'utf8';
    var header = {
        'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': '*' 
    };

    if (path.indexOf('favicon') > -1) return false;
    if (path.substr(-3) === '.js')  header['Content-Type'] = 'text/javascript'; 
    if (path.substr(-4) === '.css') header['Content-Type'] = 'text/css'; 

    res.writeHead(200, header);
    res.write(fs.readFileSync(__dirname + path, mode), mode);
    res.end();
});

server.listen(PORT);

console.log('Listening on port', PORT);

