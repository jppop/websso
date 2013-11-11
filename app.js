var express = require('express'),
	httpProxy = require('http-proxy'),
	hbs = require('hbs');

var app = express(),
	routingProxy = new httpProxy.RoutingProxy();

var SSO_TAG = 'x-gardianwebsso-uid';

app.configure(function() {
	app.set('view engine', 'html');
	app.engine('html', hbs.__express);
	app.use(express.bodyParser());
	app.use(express.static('public'));
});
 
app.get('/', function(req, res) {
	//req.headers['x-sso-user'] = 'jdoe';
	//routingProxy.proxyRequest(req, res, {host: 'localhost', port: 8080});
    res.render('index');
});
app.get('/about', function(req, res) {
   res.render('about');
});
app.get('/signin', function(req, res) {
	var uid = req.param('login');
	var body = 'Welcome in Wonderland, ' + uid;
	// res.setHeader('Content-Type', 'text/plain');
	// res.setHeader('Content-Length', body.length);
	// res.setHeader('x-gardianwebsso-uid', req.param('login'));
	// res.setHeader('x-gardianwebsso-cn', req.param('fullname'));
	// res.setHeader('x-gardianwebsso-statut', req.param('status'));
	// res.setHeader('x-gardianwebsso-org', req.param('orgUnit'));
	// res.setHeader('x-gardianwebsso-nivauth', req.param('roles'));
	res.cookie('x-gardianwebsso-uid', uid);
	//res.end(body);
	res.writeHead(302, {
		'Location': 'http://localhost:8080/',
		'Set-Cookies': 'x-gardianwebsso-uid=' + uid + '; path=/',
		'x-gardianwebsso-uid': uid
	});
	res.end();

 });

app.listen(3000);

//
// Create a proxy server with custom application logic
//
httpProxy.createServer(function (req, res, proxy) {
	if (req.headers[SSO_TAG]) {
	  proxy.proxyRequest(req, res, {
	    host: 'localhost',
	    port: 8080
	  });
	} else {
	  proxy.proxyRequest(req, res, {
	    host: 'localhost',
	    port: 3000
	  });
	}
}).listen(8000);


