const { BlogPost, User, Comment } = require('../../models');
const sequelize = require('../../config/connection');

// reset database before all tests
beforeAll(async () => {
    await sequelize.sync({ force: true });

    testUser = await User.create({
        username: 'testuser',
        password: 'password123'
    });

    testPost = await BlogPost.create({
        title: 'Test Post',
        content: 'This is a test post',
        author: 'blogposter',
        date_created: '03/28/2025',
        user_id: testUser.id
    });
});

// clean up after tests
afterAll(async () => {
    await sequelize.close();
});

describe('Comment Model', () => {
    it('should create a new comment', async () => {
        // arrange
        const commentData = {
            content: 'Nice post!',
            date_created: '03/29/2025',
            user_id: testUser.id,
            blogpost_id: testPost.id
        };

        // act 
        const comment = await Comment.create(commentData);

        // assert
        expect(comment).toHaveProperty('id');
        expect(comment.content).toBe(commentData.content);
        // fix this?
        expect(comment.date_created).toBeTruthy();
        expect(comment.user_id).toBe(commentData.user_id);
        expect(comment.blogpost_id).toBe(commentData.blogpost_id);
    });

    // test comment requirements
    it('should require content', async () => {
        const invalidComment = {
            date_created: '03/28/2025',
            user_id: testUser.id,
            blogpost_id: testPost.id
        };
        await expect(Comment.create(invalidComment)).rejects.toThrow();
    });

    // test relationship with user
    it('should associate with a user', async () => {
        const comment = await Comment.findOne({
            where: { content: 'Nice post!' },
            include: User
        });

        expect(comment.user).toBeDefined();
        expect(comment.user.username).toBe('testuser');
    });

    // test relationship with blogpost
    it('should associate with a blogpost', async () => {
        const comment = await Comment.findOne({
            where: { content: 'Nice post!' },
            include: BlogPost
        });

        expect(comment.blogPost).toBeDefined();
        expect(comment.blogPost.title).toBe('Test Post');
    });

    // test update comment
    it('should update comment details', async () => {
        const comment = await Comment.findOne({
            where: { content: 'Nice post!' }
        });

        const updatedContent = 'Updated comment.';
        await comment.update({ content: updatedContent });

        const updatedComment = await Comment.findByPk(comment.id);
        expect(updatedComment.content).toBe(updatedContent);
    });

    // test delete comment
    it('should delete a comment', async () => {
        const deleteTestComment = await Comment.create({
            content: 'This comment will be deleted in this test.',
            date_created: '03/29/2025',
            user_id: testUser.id,
            blogpost_id: testPost.id
        });

        const commentId = deleteTestComment.id;
        await deleteTestComment.destroy();

        const deletedComment = await Comment.findByPk(commentId);
        expect(deletedComment).toBeNull();
    });

    // test cascading delete (blog post deletion)
    
});