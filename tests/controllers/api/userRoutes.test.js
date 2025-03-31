const request = require('supertest');
const userRoutes = require('../../../controllers/api/userRoutes');
const setupTestApp = require('../../test-utils/setup-test-app');
const { createTestFixtures } = require('../../test-utils/test-fixtures');

describe('User Routes', () => {
    let app;
    let fixtures;

    // setup test data 
    beforeAll(async () => {
        fixtures = await createTestFixtures();
        app = setupTestApp(userRoutes, '/api/users');
    });

    // clean up after tests
    afterAll(async () => {
        await fixtures.cleanup();
    });

    // test GET all users
    describe('GET /api/users', () => {
        it('should return all users', async () => {
            const response = await request(app).get('/api/users');
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveLength(2); // two users from fixtures
            expect(response.body).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ username: 'testuser' }),
                    expect.objectContaining({ username: 'secondaryuser' })
                ])
            );
            // passwords should be excluded
            expect(response.body[0].password).toBeUndefined();
            expect(response.body[1].password).toBeUndefined();
        });
    });

    // test GET user by id
    describe('GET /api/users/id', () => {
        it('should return single user by id', async () => {
            const response = await request(app).get(`/api/users/${fixtures.testUser.id}`);
            expect(response.body.username).toBe('testuser');
            expect(response.body.password).toBeUndefined();

            // TODO: also include associated relationship data
        });

        // test error case
        it('should return 404 if user not found', async () => {
            const response = await request(app).get('/api/users/9999');
            expect(response.statusCode).toBe(404);
        });
    });

    // test POST user (signup)
    describe('POST /api/users', () => {
        // test for non-existing username
        it('should create a new user', async () => {
            const newUser = {
                username: 'newuser',
                password: 'newpassword'
            };

            const response = await request(app)
                .post('/api/users')
                .send(newUser);

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('id');
            expect(response.body.username).toBe('newuser');

            // verify user was created
            const getResponse = await request(app).get(`/api/users/${response.body.id}`);
            expect(getResponse.statusCode).toBe(200);
            expect(getResponse.body.username).toBe('newuser');
            expect(getResponse.body.password).toBeUndefined();
        });

        // test with existing username
        it('should return 400 error if username exists', async () => {
            const newUser = {
                username: 'testuser',
                password: 'newpassword'
            };

            const response = await request(app)
                .post('/api/users')
                .send(newUser);

            expect(response.statusCode).toBe(400);
        });

        //test password length 
        it('should return 400 for password less than 8 characters long', async () => {
            const newUser = {
                username: 'testuser2',
                password: '123'
            };

            const response = await request(app)
                .post('/api/users')
                .send(newUser);
                
            expect(response.statusCode).toBe(400);
        });

        // test required fields
        it('should return 400 for missing required fields', async () => {
            // test cases with missing fields
            const testCases = [
            { usrname: 'nopassword' }, // missing password
            { password: 'nouser123' }     // missing username
            ];
            
            // test each case
            for (const testCase of testCases) {
            const response = await request(app)
                .post('/api/users')
                .send(testCase);
                
            expect(response.statusCode).toBe(400);
            };
        });
    });

    // test POST user (login)
    describe('POST /api/users/login', () => {
        // test correct login credentials
        it('should login user and render dashboard', async () => {
            // create login credentials matching a fixture user
            const loginData = {
                username: 'testuser',
                password: 'password123' 
             };

            const response = await request(app)
                .post('/api/users/login')
                .send(loginData);

            // check response
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('user');
            expect(response.body.user.username).toBe('testuser');
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toBe('You are now logged in!');
            
            // session cookies should be set
            expect(response.headers['set-cookie']).toBeDefined();
        });

        // test wrong login credentials
        it('should reject login with wrong username', async () => {
            const loginData = {
                username: 'nonexistentuser',
                password: 'password123'
            };

            const response = await request(app)
                .post('/api/users/login')
                .send(loginData);

            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toBe('Incorrect username or password, please try again');
        });
    
        it('should reject login with wrong password', async () => {
            const loginData = {
                username: 'testuser',
                password: 'wrongpassword'
            };

            const response = await request(app)
                .post('/api/users/login')
                .send(loginData);

            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toBe('Incorrect username or password, please try again');
        });
    });

    // test POST user (logout)
    describe('POST /api/users/logout', () => {
        it('should log user out when logged in', async () => {
            const agent = request.agent(app);
            
            // login
            const loginResponse = await agent
                .post('/api/users/login')
                .send({
                    username: 'testuser',
                    password: 'password123'
                });
            
            expect(loginResponse.statusCode).toBe(200);
            
            // logout
            const logoutResponse = await agent.post('/api/users/logout');
            expect(logoutResponse.statusCode).toBe(204);
            
            // after logout, verify we can't access user-specific data
            // this depends on your app's behavior - you might redirect or reject
            // tet's just check that logged_in is false if we try to check session
            
            // we can't easily check the session directly, so just make sure 
            // your app behaves correctly when the user is logged out
            
            // ror example, if your app has an endpoint that returns session data:
            const sessionResponse = await agent.get('/api/users/check-session');
            expect(sessionResponse.body.logged_in).toBeFalsy();
        });
    
        it('should return 404 when trying to logout while not logged in', async () => {
            const response = await request(app).post('/api/users/logout');
            expect(response.statusCode).toBe(404);
        });
    });
});