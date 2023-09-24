const router = require("express").Router();
const { Comment } = require("../../models");
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
        const commentData = await Comment.create({
            ...req.body,
        });
        res.status(200).json(commentData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// delete a comment by id
router.delete('/:id', withAuth, async (req, res) => {
    try {
        const commentData = await User.destroy({
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