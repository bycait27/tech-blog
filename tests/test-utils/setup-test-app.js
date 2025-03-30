const express = require('express');
const session = require('express-session');

/**
 * creates and configures an Express app for testing routes
 * @param {object} routerModule - the router module to test
 * @param {string} mountPath - the path where the router should be mounted
 * @returns {object} the configured Express app
 */
function setupTestApp(routerModule, mountPath = '/') {
  const app = express();
  
  // configure session middleware
  app.use(session({
    secret: 'test-secret',
    resave: false,
    saveUninitialized: true,
    cookie: {}
  }));
  
  // configure express to parse JSON and handle forms
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // setup mock handlebars for testing
  app.engine('handlebars', (path, options, callback) => {
    // return JSON representation of the template variables
    callback(null, JSON.stringify(options));
  });
  app.set('view engine', 'handlebars');
  
  // add helper for attaching authentication in tests
  app.mockLoggedIn = (userId) => {
    return (req) => {
      req.session = { logged_in: true, user_id: userId };
      return req;
    };
  };
  
  // mount the router
  app.use(mountPath, routerModule);
  
  return app;
}

module.exports = setupTestApp;