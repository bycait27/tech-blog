const { User, BlogPost, Comment } = require('../../models');
const sequelize = require('../../config/connection');

/**
 * creates test data for application routes testing
 * @returns {Object} object containing test data instances and cleanup function
 */
async function createTestFixtures() {
  // reset the database
  await sequelize.sync({ force: true });
  
  // create test user
  const testUser = await User.create({
    username: 'testuser',
    password: 'password123'
  });
  
  // create secondary user for auth tests
  const secondaryUser = await User.create({
    username: 'secondaryuser',
    password: 'password123'
  });
  
  // create test blog post
  const testBlogPost = await BlogPost.create({
    title: 'Test Blog Post',
    content: 'This is test content for a blog post.',
    author: 'testuser',
    user_id: testUser.id
  });
  
  // create a secondary post owned by the second user (for auth tests)
  const secondaryBlogPost = await BlogPost.create({
    title: 'Secondary User Post',
    content: 'This post belongs to the secondary user.',
    author: 'secondaryuser',
    user_id: secondaryUser.id
  });
  
  // create test comment
  const testComment = await Comment.create({
    content: 'This is a test comment.',
    user_id: testUser.id,
    blogpost_id: testBlogPost.id
  });
  
  // cleanup function
  const cleanup = async () => {
    await sequelize.close();
  };
  
  return {
    testUser,
    secondaryUser,
    testBlogPost,
    secondaryBlogPost,
    testComment,
    cleanup
  };
}

module.exports = { createTestFixtures };