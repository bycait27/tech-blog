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

// create user/ sign-up
router.post('/', async (req, res) => {
    try {
      console.log('Creating user with:', req.body);
        const userData = await User.create(req.body);
        console.log('User created:', userData);

        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;
      
            res.status(200).json(userData);
        });
    } catch (err) {
      console.error('Error creating user:', err);

      // check for specific error types
      if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ message: 'Username already exists' });
      }
    
      if (err.name === 'SequelizeValidationError') {
        return res.status(400).json({ message: err.message });
      }

      res.status(500).json({
        message: 'Error creating user',
        error: err.message,
        errorType: err.name
      });
    }
});

// login
router.post('/login', async (req, res) => {
    try {
      console.log('Login attempt for user:', req.body.username);

       // find the user in the database - add order to ensure we get the most recent user record
       const userData = await User.findOne({ 
        where: { username: req.body.username },
        // order: [['id', 'DESC']] // get the most recently created user with this username
    });

      console.log('Received username:', req.body.username);
      console.log('Received password:', req.body.password);
      console.log('Found user data:', userData);
  
      if (!userData) {
        console.log('User not found:', req.body.username);
        res
          .status(400)
          .json({ message: 'Incorrect username or password, please try again' });
        return;
      }

      console.log('User found, ID:', userData.id, 'Checking password');

      // check if the password is correct - add some debugging here
      console.log('Comparing password from request with hashed password in DB');
      console.log('Password from request length:', req.body.password.length);
  
      const validPassword = userData.checkPassword(req.body.password);

      console.log('Password validation result:', validPassword);
  
      if (!validPassword) {
        console.log('Invalid password for user:', req.body.username);
        res
          .status(400)
          .json({ message: 'Incorrect username or password, please try again' });
        return;
      }

      // session debugging
      console.log('Before session save - session object:', req.session);
  
      req.session.save((err) => {
        if (err) {
          console.error('Session save error:', err);
          res.status(500).json({ message: 'Error saving session', error: err.toString() });
          return;
        }

        req.session.user_id = userData.id;
        req.session.logged_in = true;

        console.log('Login successful for user:', req.body.username);
        res.json({ user: userData, message: 'You are now logged in!' });
        console.log('Session data:', req.session);
      });
  
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ message: 'Server error during login', error: err.message });
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