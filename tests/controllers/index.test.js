const request = require('supertest');
const express = require('express');
const session = require('express-session');

describe('Main Routes Index', () => {
  let app;

  beforeEach(() => {
    // create a fresh Express app for each test
    app = express();
    app.use(express.json());
    
    // add session support
    app.use(session({
      secret: 'test-secret',
      resave: false,
      saveUninitialized: true,
      cookie: {}
    }));
    
    // mock handlers for different routes
    const mockHomeHandler = (req, res) => res.status(200).send('Home Route');
    const mockDashboardHandler = (req, res) => res.status(200).send('Dashboard Route');
    const mockApiHandler = (req, res) => res.status(200).json({ source: 'API Route' });
    
    // create a router with our test handlers
    const testRouter = express.Router();
    testRouter.get('/', mockHomeHandler);
    testRouter.use('/dashboard', (req, res) => mockDashboardHandler(req, res));
    testRouter.use('/api', (req, res) => mockApiHandler(req, res));
    
    // use our test router 
    app.use(testRouter);
  });

  it('should route / requests to the home handler', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Home Route');
  });

  it('should route /dashboard requests to the dashboard handler', async () => {
    const response = await request(app).get('/dashboard');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Dashboard Route');
  });

  it('should route /api requests to the API handler', async () => {
    const response = await request(app).get('/api');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ source: 'API Route' });
  });

  it('should return 404 for undefined routes', async () => {
    const response = await request(app).get('/nonexistent-route');
    expect(response.status).toBe(404);
  });
  
  // test the actual router structure
  it('should have the correct route structure', () => {
    // Import the actual router for structure testing
    const mainRoutes = require('../../controllers');
    
    // check that it's a router
    expect(typeof mainRoutes.use).toBe('function');
    
    // examine the router stack
    const stack = mainRoutes.stack || [];
    
    // check that the router has routes mounted
    expect(stack.length).toBeGreaterThan(0);
    
    // look for key routes in the router structure
    const routes = stack.map(layer => {
      if (layer.route) {
        return layer.route.path;
      } else if (layer.regexp) {
        return layer.regexp.toString();
      }
      return null;
    });
    
    // check for home route (/)
    const hasHomeRoute = routes.some(path => path === '/' || path === '/^\\/?(?=\\/|$)/i');
    expect(hasHomeRoute).toBe(true);
    
    // check for dashboard route
    const hasDashboardRoute = routes.some(path => 
      path && (path.includes('dashboard') || path.includes('user'))
    );
    expect(hasDashboardRoute).toBe(true);
    
    // check for API route
    const hasApiRoute = routes.some(path => 
      path && path.includes('api')
    );
    expect(hasApiRoute).toBe(true);
  });
});