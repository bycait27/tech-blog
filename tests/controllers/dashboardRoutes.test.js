const request = require('supertest');
const { User, BlogPost } = require('../../models');
const dashboardRoutes = require('../../controllers/dashboardRoutes');
const sequelize = require('../../config/connection');
const setupTestApp = require('../test-utils/setup-test-app');

describe('Dashboard Routes', () => {
    let app;
    let testUser;
    let testBlogPost;

    // setup test environment
    beforeAll(async () => {
        await sequelize.sync({ force: true });

        // create test user
        testUser = await User.create({
            username: 'testdashboarduser', 
            password: 'password123'
        });

        // create test blogpost
        testBlogPost = await BlogPost.create({
            title: 'Test Dashboard Post',
            content: 'This is a test post for dashboard routes.',
            author: 'testdashboarduser',
            user_id: testUser.id
        });

        // setup Express app with helper
        app = setupTestApp(dashboardRoutes, '/dashboard');
    });

    // clean up after tests
    afterAll(async () => {
        await sequelize.close();
    });

    // test GET routes
    describe('GET /dashboard', () => {
        // test GET all posts
        it('should redirect to login if not authenticated', async () => {
            const response = await request(app).get('/dashboard');
            expect(response.statusCode).toBe(302);
            expect(response.headers.location).toBe('/login');
        });

        it('should render dashboard with user blog posts when authenticated', async () => {
            // create a pre-authenticated app instance
            const authenticatedApp = setupTestApp(
                dashboardRoutes, 
                '/dashboard',
                { authUser: testUser }
            );
            
            // make the authenticated request
            const response = await request(authenticatedApp).get('/dashboard');
            
            expect(response.statusCode).toBe(200);
            expect(response.text).toContain('Test Dashboard Post');
        });

        // test GET post by id to edit
        it('should redirect to login if not authenticated when trying to edit a post', async () => {
            const response = await request(app).get(`/dashboard/edit/${testBlogPost.id}`);
            expect(response.statusCode).toBe(302);
            expect(response.headers.location).toBe('/login');
        });

        it('should allow user to edit post when authenticated', async () => {
            // create a pre-authenticated app instance
            const authenticatedApp = setupTestApp(
                dashboardRoutes, 
                '/dashboard',  // mount at /dashboard
                { authUser: testUser }
            );
            
            // make the authenticated request to /dashboard/edit/[actual-id]
            const response = await request(authenticatedApp).get(`/dashboard/edit/${testBlogPost.id}`);
            
            expect(response.statusCode).toBe(200);
            expect(response.text).toContain('Test Dashboard Post');
        });

        // test GET new post 
        it('should redirect to login if not authenticated when trying to create a new post', async () => {
            const response = await request(app).get('/dashboard/new');
            expect(response.statusCode).toBe(302);
            expect(response.headers.location).toBe('/login'); 
        });

        it('should allow user to create a new post when authenticated', async () => {
            // create a pre-authenticated app instance
            const authenticatedApp = setupTestApp(
                dashboardRoutes, 
                '/dashboard',  // mount at /dashboard
                { authUser: testUser }
            );
                        
            // make the authenticated request to create new post
            const response = await request(authenticatedApp).get('/dashboard/new');
                        
            expect(response.statusCode).toBe(200);
            expect(response.text).toContain('logged_in');
        });
    });

});