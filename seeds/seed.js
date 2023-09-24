const sequelize = require('../config/connection');
const { User, BlogPost } = require('../models');

const userData = require('./userData.json');
const blogPostData = require('./blogPostData.json');
const commentData = require('./commentData.json');


const seedDatabase = async () => {
    try {
        await sequelize.sync({ force: true });

        const users = await User.bulkCreate(userData, {
            individualHooks : true,
            returning: true,
        });

        for (const blogPost of blogPostData) {
            await BlogPost.create({
                ...blogPost,
                user_id: users[Math.floor(Math.random() * users.length)].id
            });
        }

        // await Comment.bulkCreate(
        //     commentData.map((data) => ({
        //         ...data,
        //         UserId: users.find((user) => user.name === data.userName).id,
        //         BlogPostId: blogPosts.find((post) => post.title === data.postTitle).id,
        //     }))
        // );

        console.log('Data seeded successfully!');
    } catch (error) {
        console.log('Error seeding data', error);
    } finally {
        process.exit(0);
    }
};

seedDatabase();