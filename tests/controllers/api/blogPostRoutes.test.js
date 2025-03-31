const request = require('supertest');
const blogPostRoutes = require('../../../controllers/api/blogPostRoutes');
const setupTestApp = require('../../test-utils/setup-test-app');
const { createTestFixtures } = require('../../test-utils/test-fixtures');

describe('BlogPost Routes', () => {
    let app;
    let fixtures;

    // setup test data 
    beforeAll(async () => {
        fixtures = await createTestFixtures();
        app = setupTestApp(blogPostRoutes, '/api/blogposts');
    });

    // clean up after tests
    afterAll(async () => {
        await fixtures.cleanup();
    });

    // test GET all blogposts
    describe('GET /api/blogposts', () => {
        it('should return all blog posts', async () => {
            const response = await request(app).get('/api/blogposts');
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveLength(2); // two posts from fixtures
            expect(response.body[0].title).toBe('Test Blog Post');
            expect(response.body[1].title).toBe('Secondary User Post');
        });
    });
    
    // test GET post by id
    describe('GET /api/blogposts/id', () => {
        it('should return single blog post by id', async () => {
            const response = await request(app).get(`/api/blogposts/${fixtures.testBlogPost.id}`);
            // blogpost data
            expect(response.statusCode).toBe(200);
            expect(response.body.title).toBe('Test Blog Post');
            expect(response.body.content).toBe('This is test content for a blog post.');

            // user association
            expect(response.body.user).toBeDefined();
            expect(response.body.user.username).toBe('testuser')

            // comment association
            expect(response.body.comments).toBeDefined();
            expect(Array.isArray(response.body.comments)).toBe(true);
            expect(response.body.comments).toHaveLength(1);
            expect(response.body.comments[0].content).toBe('This is a test comment.');
            expect(response.body.comments[0].user.username).toBe('testuser');
        });

        // test error case
        it('should return 404 if post not found', async () => {
            const response = await request(app).get('/api/blogposts/9999');
            expect(response.statusCode).toBe(404);
        });
    });

    // test POST a blogpost
    describe('POST /api/blogposts', () => {
        // test for authenticated user
        it('should create a new blog post', async () => {
            // create authenticated app
            const authApp = setupTestApp(
                blogPostRoutes,
                '/api/blogposts',
                { authUser: fixtures.testUser }
            );

            // for new post creation
            const newPost = {
                title: 'New Post',
                content: 'New post content.'
            };

            const response = await request(authApp)
                .post('/api/blogposts')
                .send(newPost);

            // blogpost data
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('id');
            expect(response.body.title).toBe('New Post');
            expect(response.body.content).toBe('New post content.');
            expect(response.body.user_id).toBe(fixtures.testUser.id);

            // verify post was created
            const getResponse = await request(app).get(`/api/blogposts/${response.body.id}`);
            expect(getResponse.statusCode).toBe(200);
            expect(getResponse.body.title).toBe('New Post');
            expect(getResponse.body.content).toBe('New post content.');
        });

        // test for unathenticated user
        it('should return 302 when not logged in', async () => {
            const newPost = {
                title: 'Unauthorized Post',
                content: 'This post should not be created'
            };
            
            // try to create a post without authentication
            const response = await request(app)
                .post('/api/blogposts')
                .send(newPost);
                
            expect(response.statusCode).toBe(302);
        });

        // test for required fields
        it('should return 500 for posts with missing required fields', async () => {
            // create authenticated app
            const authenticatedApp = setupTestApp(
            blogPostRoutes,
            '/api/blogposts',
            { authUser: fixtures.testUser }
            );
            
            // test cases with missing fields
            const testCases = [
            { title: 'Post with Missing Content' }, // missing content
            { content: 'Post without a title' }     // missing title
            ];
            
            // test each case
            for (const testCase of testCases) {
            const response = await request(authenticatedApp)
                .post('/api/blogposts')
                .send(testCase);
                
            expect(response.statusCode).toBe(500);
            };
        });
    });

    // test PUT or edit a blogpost by id
    describe('PUT /api/blogposts/id', () => {
        // test for authenticated user
        it('should update a blogpost', async () => {
            // create authenticated app
            const authApp = setupTestApp(
                blogPostRoutes,
                '/api/blogposts',
                { authUser: fixtures.testUser }
            );

            const updatedPost = {
                title: 'Updated Title',
                content: 'Updated content.'
            };

            const response = await request(authApp)
                .put(`/api/blogposts/${fixtures.testBlogPost.id}`)
                .send(updatedPost);
        
            // blogpost data
            expect(response.statusCode).toBe(200); 
            expect(response.body.title).toBe('Updated Title');
            expect(response.body.content).toBe('Updated content.');

            // verify post was updated
            const getResponse = await request(app).get(`/api/blogposts/${fixtures.testBlogPost.id}`);
            expect(getResponse.statusCode).toBe(200);
            expect(getResponse.body.title).toBe('Updated Title');
            expect(getResponse.body.content).toBe('Updated content.');
        });

        // test for unathenticated user
        it('should return 302 when not logged in', async () => {
            const updatePost = {
                title: 'Unauthorized Update',
                content: 'This update should not work.'
            };
    
            // try to update without authentication
            const response = await request(app)
                .put(`/api/blogposts/${fixtures.testBlogPost.id}`)
                .send(updatePost);
                
            expect(response.statusCode).toBe(302);
        });

        // test for user trying to update another user's post
        it('should prevent updating another user\'s post', async () => {
            // create authenticated app with secondary user
            const authApp = setupTestApp(
                blogPostRoutes,
                '/api/blogposts',
                { authUser: fixtures.secondaryUser }
            );

            const updatePost = {
                title: 'Trying to modify someone else\'s post',
                content: 'This should not be allowed.'
            };

            const response = await request(authApp)
                .put(`/api/blogposts/${fixtures.testBlogPost.id}`)
                .send(updatePost);
            
            // should be 403 (forbidden)
            expect(response.statusCode).toBe(403);
        });
    });

    // test DELETE a blogpost by id
    describe('DELETE /api/blogposts/id', () => {
        // test for authenticated user
        it('should delete a blogpost by id', async () => {
            // create authenticated app
            const authApp = setupTestApp(
                blogPostRoutes,
                '/api/blogposts',
                { authUser: fixtures.testUser }
            );

            const response = await request(authApp)
                .delete(`/api/blogposts/${fixtures.testBlogPost.id}`);
            expect(response.statusCode).toBe(200);
        });

        // testfor unauthenticated user
        it('should return 302 if not logged in', async () => {
            const response = await request(app)
                .delete(`/api/blogposts/${fixtures.testBlogPost.id}`);
            expect(response.statusCode).toBe(302);
        });

        // TODO: test for non-existent post
        // it('should return 404 for blogpost not found', async () => {
        // });

        // TODO: test for a different user trying to delete another user's post

    });
});