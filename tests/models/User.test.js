const { User } = require('../../models');
const sequelize = require('../../config/connection');

// reset database before all tests
beforeAll(async () => {
    await sequelize.sync({ force: true });
});

// clean up after tests
afterAll(async () => {
    await sequelize.close();
});

describe('User Model', () => {
    it('should create a new user', async () => {
        // arrange
        const userData = {
            username: 'testuser',
            password: 'password123'
        };

        // act
        const user = await User.create(userData);

        // assert
        expect(user).toHaveProperty('id');
        expect(user.username).toBe(userData.username);
        // password should be hashed and not the same as input
        expect(user.password).not.toBe(userData.password);
    });

    // test requirements
    it('should require username and password', async () => {
        // attempt to create user without required fields
        await expect(User.create({})).rejects.toThrow();
    });
});