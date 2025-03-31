const withAuth = (req, res, next) => {
  // first check if session exists, then check if user is logged in
  if (!req.session || !req.session.logged_in) {
    res.redirect('/login');
  } else {
    next();
  }
};

module.exports = withAuth;