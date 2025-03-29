const { BlogPost, User } = require('../../models');
const sequelize = require('../../config/connection');

let testUser;

// reset database before all tests
beforeAll(async () => {
    await sequelize.sync({ force: true });
    
    testUser = await User.create({
        username: 'blogposter',
        password: 'password123',
    });
});

// clean up after tests
afterAll(async () => {
    await sequelize.close();
});

describe('BlogPost Model', () => {
    it('should create a new blogpost', async () => {
        // arrange 
        const blogPostData = {
            title: 'The Rise of TypeScript in Modern Web Development',
            content: 'In recent years, TypeScript has gained immense popularity in the web development community. Its ability to catch errors at compile-time, offer better code maintainability, and provide a seamless transition from JavaScript has made it a favorite among developers. Many popular frameworks, including Angular and Next.js, now fully support TypeScript, making it easier for developers to adopt. As TypeScript continues to evolve, its ecosystem is expected to expand further, empowering developers to build more robust and scalable applications.',
            author: 'blogposter',
            date_created: '03/29/2025',
            user_id: testUser.id
        };

        // act
        const blogPost = await BlogPost.create(blogPostData);

        // assert
        expect(blogPost).toHaveProperty('id');
        expect(blogPost.title).toBe(blogPostData.title);
        expect(blogPost.content).toBe(blogPostData.content);
        expect(blogPost.author).toBe(blogPostData.author);
        // fix this?
        expect(blogPost.date_created).toBeTruthy();
        expect(blogPost.user_id).toBe(blogPostData.user_id);
    });

    // test blogpost requirements
    it('should require a title', async () => {
        const invalidPost = {
            content: 'Content without a title',
            author: 'blogposter',
            user_id: testUser.id
        };
        await expect(BlogPost.create(invalidPost)).rejects.toThrow();
    });

    it('should require content', async () => {
        const invalidPost = {
            title: 'Title without content',
            author: 'blogposter',
            user_id: testUser.id
        };
        await expect(BlogPost.create(invalidPost)).rejects.toThrow();
    });

    // test relationship with user
    it('should associate with a user', async () => {
        const blogPost = await BlogPost.findOne({
            where: { title: 'The Rise of TypeScript in Modern Web Development' },
            include: User
        });

        expect(blogPost.user).toBeDefined();
        expect(blogPost.user.username).toBe('blogposter');
    });

    // test update functionality
    it('should update blogpost details', async () => {
        const blogPost = await BlogPost.findOne({
            where: { title: 'The Rise of TypeScript in Modern Web Development' }
        });

        const updatedTitle = 'TypeScript in Modern Web Dev';
        await blogPost.update({ title: updatedTitle });

        const updatedPost = await BlogPost.findByPk(blogPost.id);
        expect(updatedPost.title).toBe(updatedTitle);
    });

    // test delete functionality
    it('should delete a blogpost', async () => {
        const deleteTestPost = await BlogPost.create({
            title: 'Post to be deleted',
            content: 'This post will be deleted in the test',
            author: 'blogposter',
            user_id: testUser.id
        });

        const postId = deleteTestPost.id
        await deleteTestPost.destroy();

        const deletedPost = await BlogPost.findByPk(postId);
        expect(deletedPost).toBeNull();
    });
});