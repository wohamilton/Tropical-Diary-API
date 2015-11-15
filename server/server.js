var bodyParser = require('body-parser');
var boot = require('loopback-boot');
var loopback = require('loopback');
var path = require('path');
var app = module.exports = loopback();

app.middleware('initial', bodyParser.urlencoded({ extended: true }));


app.set('view engine', 'jade'); // LoopBack comes with EJS out-of-box
app.set('json spaces', 2); // format json responses for easier viewing

// must be set to serve views properly when starting the app via `slc run` from
// the project root
app.set('views', path.resolve(__dirname, 'views'));

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;


//Use Bluemix host and port ...  
//  var host = process.env.VCAP_APP_HOST || 'localhost';
//  var port = process.env.VCAP_APP_PORT || 1337;
//  app.set('host', host);
//  app.set('port', port); 


  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
