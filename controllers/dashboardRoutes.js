const router = require("express").Router();
const sequelize = require("../config/connection");
const { BlogPost, User, Comment } = require("../models");
const withAuth = require('../utils/auth');

// get all blogposts from user and render to dashboard
router.get('/', withAuth, async (req, res) => {
    try {
        const blogPostData =  await BlogPost.findAll({
            where: {
                user_id: req.session.user_id,
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

        const blogPosts = blogPostData.map((blogPost) => blogPost.get({ plain: true }));

        res.render('dashboard', {
            blogPosts,
            logged_in: true
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// edit blogpost by id
router.put('/edit/:id', withAuth, async (req, res) => {
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

        res.render('edit-blogPost', {
            blogPost,
            logged_in: true
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// delete blogpost by id
router.delete('/edit/:id', withAuth, async (req, res) => {
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

        res.render('delete-blogPost', {
            blogPost,
            logged_in: true
        });
    } catch (err) {
        res.setMaxListeners(500).json(err);
    }
});

module.exports = router;