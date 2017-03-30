'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');
var path = require('path');

var app = module.exports = loopback();

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

  app.use(loopback.static(path.resolve(__dirname, '..', 'dist')));
  app.use('/api', loopback.rest());

  // This is needed for html5mode in Angular, after all other routes are
  // setup we just send index.html for all other requests
  // https://gist.github.com/clarkbw/93bcbbc13bad80eb472a
  app.all('/*', function(req, res) {
      // Just send the index.html for other files to support HTML5Mode
      res.sendFile('index.html',
          {root: path.resolve(__dirname, '..', 'dist')});
  });

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
