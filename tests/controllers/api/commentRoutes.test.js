const request = require('supertest');
const commentRoutes = require('../../../controllers/api/commentRoutes');
const setupTestApp = require('../../test-utils/setup-test-app');
const { createTestFixtures } = require('../../test-utils/test-fixtures');

describe('Comment Routes', () => {
    let app;
    let fixtures;

    // setup test data 
    beforeAll(async () => {
        fixtures = await createTestFixtures();
        app = setupTestApp(commentRoutes, '/api/comments');
    });

    // clean up after tests
    afterAll(async () => {
        await fixtures.cleanup();
    });

    // test GET all comments
    describe('GET /api/comments', () => {
        it('should display all comments', async () => {
            const response = await request(app).get('/api/comments');
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveLength(1);
            expect(response.body[0].content).toBe('This is a test comment.');
        });

        // TODO: test error case
    });

    // test POST new comment
    describe('POST /api/comments', () => {
        // test for authenticated user
        it('should create a new comment', async () => {
            // create authenticated app
            const authApp = setupTestApp(
                commentRoutes,
                '/api/comments',
                { authUser: fixtures.testUser }
            );

            // for new comment creation
            const newComment = {
                comment: 'New comment content.',
                blogpost_id: fixtures.testBlogPost.id
            };

            const response = await request(authApp)
                .post('/api/comments')
                .send(newComment);

            // comment data
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('id');
            expect(response.body.content).toBe('New comment content.');
            expect(response.body.blogpost_id).toBe(fixtures.testBlogPost.id);
            expect(response.body.user_id).toBe(fixtures.testUser.id);

            // verify comment was created
            const getResponse = await request(app).get('/api/comments');
            expect(getResponse.statusCode).toBe(200);
            expect(getResponse.body.some(comment => 
                comment.content === 'New comment content.'
            )).toBe(true);
        });

        // test for unauthenticated user
        it('should return 302 when not logged in', async () => {
            const newComment = {
                comment: 'Unauthorized comment.',
                blogpost_id: fixtures.testBlogPost.id
            };
                    
            // try to create a comment without authentication
            const response = await request(app)
                .post('/api/comments')
                .send(newComment);
                        
            expect(response.statusCode).toBe(302);
        });

        // test for required fields
        // it('should return 500 for comments with missing required fields', async () => {
        //     // create authenticated app
        //     const authenticatedApp = setupTestApp(
        //         commentRoutes,
        //         '/api/comments',
        //         { authUser: fixtures.testUser }
        //     );
            
        //     // test cases with missing fields
        //     const testCases = [
        //         { comment: 'Comment with missing blogpost_id' }, // missing blogpost_id
        //         { blogpost_id: fixtures.testBlogPost.id }     // missing comment
        //     ];
            
        //     // test each case
        //     for (const testCase of testCases) {
        //         const response = await request(authenticatedApp)
        //             .post('/api/comments')
        //             .send(testCase);
                
        //         expect(response.statusCode).toBe(500);
        //     };
        // });
    });

    // test DELETE comment by id
    describe('DELETE /api/comments/id', () => {
        // TODO: test for authenticated user
        it('should delete a comment by id', async () => {
             // create authenticated app
             const authApp = setupTestApp(
                commentRoutes,
                '/api/comments',
                { authUser: fixtures.testUser }
            );

            const response = await request(authApp)
                .delete(`/api/comments/${fixtures.testComment.id}`);
            expect(response.statusCode).toBe(200);
        });

        // TODO: test for unathenticated user
        it('should return 302 if not logged in', async () => {
            const response = await request(app)
                .delete(`/api/comments/${fixtures.testComment.id}`);
            expect(response.statusCode).toBe(302);
        });

        // TODO: test error case

        // TODO: test for a different user trying to delete another user's comment
    });
});