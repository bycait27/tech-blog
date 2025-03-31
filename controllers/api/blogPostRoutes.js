const router = require('express').Router();
const { BlogPost, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// get all blogposts
router.get('/', async (req, res) => {
    try {
        const blogPostData = await BlogPost.findAll({
            include: [
                {
                    model: Comment,
                    attributes: ['id', 'content', 'date_created', 'user_id', 'blogpost_id'],
                    include: {
                        model: User,
                        attributes: ['username'],
                    },
                },
                {
                    model: User,
                    attributes: ['username'],
                },
            ],
        });

        res.status(200).json(blogPostData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// get blogpost by id
router.get('/:id', async (req, res) => {
    try {
        const blogPostData =  await BlogPost.findOne({
            where: {
                id: req.params.id,
            },
            include: [
                {
                    model: Comment,
                    attributes: ['id', 'content', 'date_created', 'user_id', 'blogpost_id'],
                    include: {
                        model: User,
                        attributes: ['username'],
                    },
                },
                {
                    model: User,
                    attributes: ['username'],
                },
            ],
        });

        if (!blogPostData) {
            res.status(404).json({ messsage: 'No blogpost found with this id!' });
            return;
        }
        res.status(200).json(blogPostData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// create a blogpost
router.post('/', withAuth, async (req, res) => {
    try {
        const { title, content } = req.body;
        const user_id = req.session.user_id;

        console.log('Received data:', { title, content, user_id });

        const user = await User.findByPk(user_id);
        const author = user.username;

        const blogPostData = await BlogPost.create({
            title,
            content, 
            author,
            user_id,
        });

        console.log('Blogpost created:', blogPostData);

        res.status(200).json(blogPostData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// edit a blogpost
router.put('/:id', withAuth, async (req, res) => {
    try {
        console.log('Received data:', req.body);

        // first, check if the blog post exists and belongs to the user
        const blogPost = await BlogPost.findOne({
            where: {
                id: req.params.id,
            },
        });

        // ff no blog post found with this ID
        if (!blogPost) {
            res.status(404).json({ message: 'No blog post found with this id!' });
            return;
        }

        // check if the user is the owner of this blog post
        if (blogPost.user_id !== req.session.user_id) {
            res.status(403).json({ message: 'You can only edit your own posts!' });
            return;
        }

        // if auth passes, proceed with update
        const [updatedRows] = await BlogPost.update(
            {
                title: req.body.title,
                content: req.body.content,
            },
            {
                where: {
                    id: req.params.id,
                },
            }
        );

        console.log('Updated rows:', updatedRows);

        if (updatedRows === 0) {
            res.status(404).json({ message: 'No blogpost found with this id!' });
            return;
        }

        // Fetch the updated blog post after the update operation
        const updatedBlogPost = await BlogPost.findByPk(req.params.id);
        console.log('Updated blog post:', updatedBlogPost);

        res.status(200).json(updatedBlogPost);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

// delete a blogpost
router.delete('/:id', withAuth, async (req, res) => {
    try {
        const blogPostData = await BlogPost.destroy({
            where: {
                id: req.params.id,
                user_id: req.session.user_id,
            },
        });

        if (!blogPostData) {
            res.status(404).json({ message: 'No blogpost found with this id!' });
            return;
        }
        res.status(200).json(blogPostData);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;