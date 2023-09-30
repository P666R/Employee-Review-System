const passport = require('passport');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');

// Render the registration form view
exports.registerForm = (req, res) => {
  res.render('auth/register');
};

// Process the registration form data
exports.register = async (req, res) => {
  try {
    const { name, email, password, passwordConfirm } = req.body;

    // Check if the passwords match
    if (password !== passwordConfirm) {
      req.flash('error', 'Passwords do not match');
      return res.redirect('back');
    }

    // Check if a user with the same email already exists
    const user = await User.findOne({ email });

    if (!user) {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create a new user with the provided name, email, and hashed password
      await User.create({ name, email, password: hashedPassword });

      // Display a success message and redirect to the login page
      req.flash('success', 'User created successfully');
      res.redirect('/auth/login');
    } else {
      // Display an error message if a user with the same email already exists
      req.flash('error', 'User already exists');
      res.redirect('/auth/login');
    }
  } catch (error) {
    // Display an error message if there was an internal server error
    req.flash('error', 'Internal server error');
    res.redirect('/auth/register');
  }
};

// Render the login form view
exports.loginForm = (req, res) => {
  res.render('auth/login');
};

// Process the login form data
exports.login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err || !user) {
      // Display an error message if the credentials are invalid
      req.flash('error', 'Invalid credentials');
      return res.redirect('/auth/login');
    }

    // Log in the user
    req.logIn(user, (err) => {
      if (err) {
        // Display an error message if there was an error during login
        req.flash('error', 'Error during login');
        return res.redirect('/auth/login');
      }

      // Redirect the user to the appropriate page based on their role
      const redirectURL = user.isAdmin ? '/admin' : '/employee';
      return res.redirect(redirectURL);
    });
  })(req, res, next);
};

// Log out the user
exports.logout = (req, res) => {
  req.logout();
  // Display a success message and redirect to the login page
  req.flash('success', 'Logged out successfully');
  res.redirect('/auth/login');
};

// Middleware to check if the user is an admin
exports.isAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    // Display an error message if the user is not authorized
    req.flash(
      'error',
      'You are not authorized. Only admin can access this page'
    );
    return res.redirect('/auth/login');
  }
  return next();
};
