var express = require('express'),
    httpProxy = require('http-proxy'),
    //url = require('url'),
    hbs = require('hbs');

var app = express(),
    authenticated = false
    trustedUser = undefined
    backurl = '';

var options = {
    sso_tag: 'x-gardianwebsso-uid',
    target: {host: 'localhost', port: 8080}
}

app.configure(function() {
    app.set('view engine', 'html');
    app.engine('html', hbs.__express);
    app.use(express.bodyParser());
    app.use(express.static('public'));
});

app.get('/', function(req, res) {
    //console.log('sso: ' + JSON.stringify(req.query, true, 2));
    res.render('index');
});
app.get('/about', function(req, res) {
   res.render('about');
});
app.post('/signin', function(req, res) {
    trustedUser = req.body.login;
    authenticated = true;
    res.writeHead(302, {
     'Location': 'http://localhost:8000' + backurl
    });
    res.end();
 });
app.get('/ssologoff', function(req, res) {
    var body = 'Hasta la vista ' + trustedUser;
    trustedUser = undefined;
    authenticated = false;
    res.end(body);
});

app.listen(3000);

//
// Create a proxy server with custom application logic
//
httpProxy.createServer(function (req, res, proxy) {
    if (authenticated && !req.url.match(/ssologoff/)) {
        req.headers[options.sso_tag] = trustedUser;
        proxy.proxyRequest(req, res, {
            host: options.target.host,
            port: options.target.port
      });
    } else {
        backurl = req.url.match(/ssologoff/) ? "/" : req.url;
        authenticated = false;
        res.writeHead(302, {
            'Location': 'http://localhost:3000/',
        });
        res.end();
    }
}).listen(8000);


