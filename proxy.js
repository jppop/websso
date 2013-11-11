var util = require('util'),
    colors = require('colors'),
    http = require('http'),
    httpProxy = require('http-proxy');

//
// Create a proxy server with custom application logic
//
httpProxy.createServer(function (req, res, proxy) {
  req.headers['x-sso-user'] = 'jdoe';
  proxy.proxyRequest(req, res, {
    host: 'localhost',
    port: 8080
  });
}).listen(8000);

http.createServer(function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write('request successfully proxied!' + '\n' + JSON.stringify(req.headers, true, 2));
  res.end();
}).listen(9000);

util.puts('http proxy server'.blue + ' started '.green.bold + 'on port '.blue + '8000'.yellow);
util.puts('http server '.blue + 'started '.green.bold + 'on port '.blue + '9000 '.yellow);
