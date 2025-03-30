const express = require('express');
const session = require('express-session');
const path = require('path');

/**
 * creates and configures an Express app for testing routes
 * @param {object} routerModule - the router module to test
 * @param {string} mountPath - the path where the router should be mounted
 * @param {object} options - additional options
 * @returns {object} the configured Express app
 */
function setupTestApp(routerModule, mountPath = '/', options = {}) {
  const app = express();
  
  // configure session middleware
  app.use(session({
    secret: 'test-secret',
    resave: false,
    saveUninitialized: true,
    cookie: {}
  }));
  
  // if authenticated user provided, create pre-authenticated session
  if (options.authUser) {
    app.use((req, res, next) => {
      req.session.logged_in = true;
      req.session.user_id = options.authUser.id;
      req.session.save(next);
    });
  }
  
  // configure express to parse JSON and handle forms
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // setup mock handlebars for testing
  app.engine('handlebars', (path, options, callback) => {
    // return JSON representation of the template variables
    callback(null, JSON.stringify(options));
  });
  app.set('view engine', 'handlebars');
  
  // mount the router
  app.use(mountPath, routerModule);
  
  return app;
}

module.exports = setupTestApp;