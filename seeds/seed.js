const sequelize = require('../config/connection');
const { User, BlogPost, Comment } = require('../models');

const userData = require('./userData.json');
const blogPostData = require('./blogPostData.json');
const commentData = require('./commentData.json');


const seedDatabase = async () => {
    try {
        await sequelize.sync({ force: true });

        // seed users
        const users = await User.bulkCreate(userData, {
            individualHooks: true,
            returning: true,
        });

        // seed blog posts
        const blogPosts = await BlogPost.bulkCreate(blogPostData.map((post) => {
            const randomUserIndex = Math.floor(Math.random() * users.length);
            return {
                ...post,
                user_id: users[randomUserIndex].id,
            };
        }));

        // seed comments
        try {
            const commentsToCreate = commentData.map((comment) => {
                // find user by username
                const user = users.find(u => u.username === comment.author);
                if (!user) {
                    console.log(`No user found with username ${comment.author}, using default user`);
                }
                
                // get random blog post
                const randomPostIndex = Math.floor(Math.random() * blogPosts.length);
                
                // Convert date string to proper date format - fixed to use correct year
                const dateParts = comment.date_created.split('/');
                const month = parseInt(dateParts[0]) - 1;   // Month (0-indexed)
                const day = parseInt(dateParts[1]);        // Day
                const year = parseInt(dateParts[2]);      // Year (already has 20)
                
                const formattedDate = new Date(2000 + year, month, day);
                
                return {
                    content: comment.content,
                    date_created: formattedDate,
                    user_id: user ? user.id : users[0].id,
                    blogpost_id: blogPosts[randomPostIndex].id
                };
            });
            
            console.log('Comments to create:', commentsToCreate);
            await Comment.bulkCreate(commentsToCreate);
            console.log('Comments created successfully!');
        } catch (commentError) {
            console.error('Error creating comments:', commentError);
        }


        // for (const blogPost of blogPostData) {
        //     await BlogPost.create({
        //         ...blogPost,
        //         user_id: users[Math.floor(Math.random() * users.length)].id
        //     });
        // }

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