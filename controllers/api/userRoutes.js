const router = require('express').Router();
const { User, BlogPost, Comment } = require('../../models');

// get all users
router.get('/', async (req, res) => {
    try {
        const userData = await User.findAll({
            attributes: { exclude: ['password'] },
        });

        res.status(200).json(userData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// get one user by id
router.get('/:id', async (req, res) => {
    try {
        const userData = await User.findOne({
            attributes: { exclude: ['password'] },
            where: {
                id: req.params.id,
            },
            include: [
                {
                    model: BlogPost,
                    atttributes: ['id', 'title', 'content', 'author', 'date_created', 'user_id'],
                },
                {
                    model: Comment,
                    attributes: ['id', 'content', 'date_created'],
                    include: {
                        model: BlogPost,
                        attributes: ['title'],
                    },
                },
            ],
        });

        if (!userData) {
            res.status(404).json({ message: 'No user found with this id!' });
            return;
        }
        res.status(200).json(userData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// create user
router.post('/', async (req, res) => {
    try {
        const userData = await User.create(req.body);

        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;
      
            res.status(200).json(userData);
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// login
router.post('/login', async (req, res) => {
    try {
      const userData = await User.findOne({ where: { username: req.body.username } });

      console.log('Received username:', req.body.username);
      console.log('Received password:', req.body.password);
      console.log('Found user data:', userData);
  
      if (!userData) {
        res
          .status(400)
          .json({ message: 'Incorrect username or password, please try again' });
        return;
      }
  
      const validPassword = await userData.checkPassword(req.body.password);
  
      if (!validPassword) {
        res
          .status(400)
          .json({ message: 'Incorrect username or password, please try again' });
        return;
      }
  
      req.session.save(() => {
        req.session.user_id = userData.id;
        req.session.logged_in = true;

        console.log('Session data:', req.session);
        
        res.json({ user: userData, message: 'You are now logged in!' });
      });
  
    } catch (err) {
      res.status(400).json(err);
    }
  });

  // logout
  router.post('/logout', (req, res) => {
    if (req.session.logged_in) {
      req.session.destroy(() => {
        res.status(204).end();
      });
    } else {
      res.status(404).end();
    }
  });
  
  module.exports = router;