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

    // test username uniqueness
    it ('should not allow duplicate usernames', async () => {
        await User.create({
            username: 'uniqueuser',
            password: 'password123',
        });

        await expect(User.create({
            username: 'uniqueuser',
            password: 'differentpassword'
        })).rejects.toThrow();
    });

    // test password validation
    it('should require password to be at least 8 characters long', async () => {
        await expect(User.create({
            username: 'validuser',
            password: 'short' // less than 8 characters
        })).rejects.toThrow();
    });

    // test password hashing hook
    it('should hash the password when updating a user', async () => {
        const user = await User.create({
            username: 'updateuser',
            password: 'password123'
        });

        const originalPassword = user.password;

        // update user password
        await user.update({ password: 'newpassword123' });

        // password should be hashed and different from original
        expect(user.password).not.toBe(originalPassword);
        expect(user.password).not.toBe('newpassword123');
    });

    // test password checking method
    it('should correctly verify passwords with checkPassword method', async () => {
        const user = await User.create({
            username: 'passwordchecker',
            password: 'correctpassword123'
        });

        expect(user.checkPassword('correctpassword123')).toBe(true);
        expect(user.checkPassword('wrongpassword')).toBe(false);
    });

    // test finding users
    it('should find a user by username', async () => {
        await User.create({
            username: 'findme',
            password: 'password123'
        });

        const foundUser = await User.findOne({ where: { username: 'findme' } });

        expect(foundUser).toBeDefined();
        expect(foundUser.username).toBe('findme');
    });

});