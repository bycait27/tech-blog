const router = require("express").Router();
const { BlogPost, User, Comment } = require("../models");

// get all blogposts and render them to homepage
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

        // serialize data 
        const blogPosts = blogPostData.map((blogPost) => blogPost.get({ plain: true }));

        // pass serialized data and session flag to template
        res.render('homepage', { 
        blogPosts, 
        logged_in: req.session.logged_in 
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// get single blogpost and render it to user
router.get('/blogpost/:id', async (req, res) => {
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

        // serialize data
        const blogPost = blogPostData.get({ plain: true });

        // pass serialized data and session flag to template
        res.render('blogpost', { 
            blogPost, 
            logged_in: req.session.logged_in 
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// get login and render it to user
router.get('/login', (req, res) => {
    // if the user is already logged in, redirect the request to another route
    if (req.session.logged_in) {
      res.redirect('/dashboard');
      return;
    }
  
    res.render('login');
});

module.exports = router;


