const router = require('express').Router();
const { User, BlogPost, Comment } = require('../../models');

// test user endpoint
router.post('/test-user', async(req, res) => {
  try {
    // delete user if exists
    await User.destroy({ 
      where: { username: 'testuser' }
    });

    // create a new test user with known credentials
    const testUser = await User.create({
      username: 'testuser',
      password: 'password12345'
    });

    res.status(200).json({
      message: 'Test user created successfully',
      username: 'testuser',
      password: 'password12345'
    });
  } catch (err) {
    console.error('Error creating test user:', err);
    res.status(500).json({ message: 'Error creating test user', error: err.message });
  }
});

// GET test user endpoint (easier to use in browser)
router.get('/test-user', async(req, res) => {
  try {
    // delete user if exists
    await User.destroy({ 
      where: { username: 'testuser' }
    });

    // create a new test user with known credentials
    const testUser = await User.create({
      username: 'testuser',
      password: 'password12345'
    });

    res.status(200).json({
      message: 'Test user created successfully',
      username: 'testuser',
      password: 'password12345'
    });
  } catch (err) {
    console.error('Error creating test user:', err);
    res.status(500).json({ message: 'Error creating test user', error: err.message });
  }
});

// GET diagnostic endpoint
router.get('/check', async(req, res) => {
  try {
    // Get all users with password hashes (for debugging)
    const users = await User.findAll();
    
    res.status(200).json({
      message: 'Diagnostic check successful',
      userCount: users.length,
      users: users.map(user => ({
        id: user.id,
        username: user.username,
        passwordHash: user.password ? user.password.substring(0, 20) + '...' : null
      })),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (err) {
    console.error('Diagnostic error:', err);
    res.status(500).json({ message: 'Error during diagnostic check', error: err.message });
  }
});

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

// session check endpoint
router.get('/session-check', (req, res) => {
  try {
    res.json({
      sessionExists: !!req.session,
      session: {
        id: req.session.id,
        user_id: req.session.user_id,
        logged_in: req.session.logged_in
      },
      cookie: req.session.cookie ? {
        maxAge: req.session.cookie.maxAge,
        httpOnly: req.session.cookie.httpOnly,
        secure: req.session.cookie.secure,
        sameSite: req.session.cookie.sameSite
      } : 'No cookie data'
    });
  } catch (err) {
    console.error('Session check error:', err);
    res.status(500).json({ 
      error: err.message,
      session: req.session ? 'Session exists' : 'No session'
    });
  }
});
  
  module.exports = router;