const request = require('supertest');
const { User, BlogPost, Comment } = require('../../models');
const homeRoutes = require('../../controllers/homeRoutes');
const sequelize = require('../../config/connection');
const setupTestApp = require('../test-utils/setup-test-app');

describe('Home Routes', () => {
    let app;
    let testUser;
    let testBlogPost;
    let testComment;

    // setup test environment
    beforeAll(async () => {
        await sequelize.sync({ force: true });

        // create test user
        testUser = await User.create({
            username: 'testhomeuser', 
            password: 'password123'
        });

        // create test blogpost
        testBlogPost = await BlogPost.create({
            title: 'Test Home Post',
            content: 'This is a test post for home routes.',
            author: 'testhomeuser',
            user_id: testUser.id
        });

        // create test comment
        testComment = await Comment.create({
            content: 'This is a test comment for home routes.',
            user_id: testUser.id,
            blogpost_id: testBlogPost.id
        });

        // setup Express app with helper
        app = setupTestApp(homeRoutes, '/');
    });

    // clean up after tests
    afterAll(async () => {
        await sequelize.close();
    });

    // test GET all posts
    describe('GET /', () => {
        it('should display homepage with blog posts', async () => {
            // don't need authentication to see all blog posts on homepage
            const response = await request(app).get('/');
            expect(response.statusCode).toBe(200);
            expect(response.text).toContain('Test Home Post');
        });
    });

    // test GET single post
    describe('GET /blogpost/:id', () => {
        it('should display a single blog post', async () => {
            const response = await request(app).get(`/blogpost/${testBlogPost.id}`);
            expect(response.statusCode).toBe(200);
            expect(response.text).toContain('Test Home Post');
        });

        it('should display 404 for non-existent post', async () => {
            const response = await request(app).get('/blogpost/9999');
            expect(response.statusCode).toBe(404);
        });
    });

    // test GET login/signup page
    describe('GET /login', () => {
        it('should display login and signup page', async () => {
            const response = await request(app).get('/login');
            expect(response.statusCode).toBe(200);
        });
    });
});