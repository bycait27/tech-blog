const router = require("express").Router();
const { Comment, User } = require("../../models");
const withAuth = require("../../utils/auth");

// get all comments
router.get('/', async (req, res) => {
    try {
        const commentData = await Comment.findAll({

        });
        res.status(200).json(commentData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// create new comment 
router.post('/', withAuth, async (req, res) => {
    try {
        const { blogpost_id, comment } = req.body;
        const user_id = req.session.user_id;

        console.log('Received data:', { blogpost_id, comment, user_id });

        const commentData = await Comment.create({
            blogpost_id,
            content: comment, 
            user_id,
        });

        console.log('Comment created:', commentData);

        res.status(200).json(commentData);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

// delete a comment by id
router.delete('/:id', withAuth, async (req, res) => {
    try {
        const commentData = await Comment.destroy({
            where: {
                id: req.params.id,
            },
        });

        if (!commentData) {
            res.status(404).json({ message: 'No comment found with this id!' });
            return;
        }
        res.status(200).json(commentData);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;