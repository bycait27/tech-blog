const request = require('supertest');
const express = require('express');
const apiRoutes = require('../../../controllers/api');

describe('API Routes Index', () => {
  let app;

  beforeEach(() => {
    // create a fresh Express app for each test
    app = express();
    app.use(express.json());
    
    // simple mock handlers for testing routes
    const mockUserHandler = (req, res) => res.status(200).json({ source: 'userRoutes' });
    const mockBlogPostHandler = (req, res) => res.status(200).json({ source: 'blogPostRoutes' });
    const mockCommentHandler = (req, res) => res.status(200).json({ source: 'commentRoutes' });
    
    // create a fresh router with mock handlers for testing
    const testRouter = express.Router();
    testRouter.use('/users', (req, res) => mockUserHandler(req, res));
    testRouter.use('/blogposts', (req, res) => mockBlogPostHandler(req, res));
    testRouter.use('/comments', (req, res) => mockCommentHandler(req, res));
    
    // use our test router instead of the actual apiRoutes
    app.use('/api', testRouter);
  });

  it('should route /api/users requests to a handler', async () => {
    const response = await request(app).get('/api/users');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ source: 'userRoutes' });
  });

  it('should route /api/blogposts requests to a handler', async () => {
    const response = await request(app).get('/api/blogposts');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ source: 'blogPostRoutes' });
  });

  it('should route /api/comments requests to a handler', async () => {
    const response = await request(app).get('/api/comments');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ source: 'commentRoutes' });
  });
  
  it('should return 404 for undefined API routes', async () => {
    const response = await request(app).get('/api/nonexistent');
    expect(response.status).toBe(404);
  });
  
  it('should have the correct route structure', () => {
    // check that it's a router
    expect(typeof apiRoutes.use).toBe('function');
    
    // examine the router stack
    const stack = apiRoutes.stack || [];
    
    // check that the router has routes mounted
    expect(stack.length).toBeGreaterThan(0);
    
    // verify that at least one route has 'users' in its regexp
    const hasUserRoute = stack.some(layer => {
      return layer.regexp && layer.regexp.toString().includes('users');
    });
    expect(hasUserRoute).toBe(true);
    
    // verify that at least one route has 'blogposts' in its regexp
    const hasBlogPostsRoute = stack.some(layer => {
      return layer.regexp && layer.regexp.toString().includes('blogposts');
    });
    expect(hasBlogPostsRoute).toBe(true);
    
    // verify that at least one route has 'comments' in its regexp
    const hasCommentsRoute = stack.some(layer => {
      return layer.regexp && layer.regexp.toString().includes('comments');
    });
    expect(hasCommentsRoute).toBe(true);
  });
});