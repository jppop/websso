var express = require('express'),
    url = require('url'),
    hbs = require('hbs');

var app = express(),
    authenticated = false
    trustedUser = undefined;

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
    console.log('sso: ' + JSON.stringify(req.query, true, 2));
    res.render('index');
});
app.get('/about', function(req, res) {
   res.render('about');
});
app.post('/signin', function(req, res) {
    console.log('signin: ' + JSON.stringify(req.body, true, 2));
    var uid = req.body.login;
    var body = 'Welcome in Wonderland, ' + uid;
    res.end(body);
 });
app.get('/ssologoff', function(req, res) {
    var body = 'Hasta la vista ' + trustedUser;
    trustedUser = undefined;
    authenticated = false;
    res.end(body);
});

app.listen(3000);


