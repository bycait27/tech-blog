const router = require("express").Router();
const { BlogPost, User, Comment } = require("../models");
const withAuth = require('../utils/auth');

// get all blogposts from user and render to dashboard
router.get('/', withAuth, async (req, res) => {
    try {
        const blogPostData =  await BlogPost.findAll({
            where: {
                user_id: req.session.user_id,
            },
            attributes: ["id", "title", "content", "date_created"],
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

        console.log("User ID from session:", req.session.user_id);
        console.log("Generated SQL Query:", blogPostData.toString());

        const blogPosts = blogPostData.map((blogPost) => blogPost.get({ plain: true }));

        res.render('dashboard', {
            blogPosts,
            logged_in: true,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// get blogpost by id to edit
router.get('/edit/:id', withAuth, async (req, res) => {
    try {
        const blogPostData = await BlogPost.findOne({
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
            res.status(404).json({ message: 'No blogpost found with this id!' });
            return;
        }

        const blogPost = blogPostData.get({ plain: true });

        // doesnt match actual file (heroku issue)
        res.render('edit-blogPost', {
            blogPost,
            logged_in: true
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// get new blogpost
router.get('/new', withAuth, (req, res) => {
    // doesnt match actual file (heroku issue)
    res.render('new-blogPost', {
        logged_in: true
    });
});

module.exports = router;