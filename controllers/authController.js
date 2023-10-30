const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');

// Render the registration form view
exports.registerForm = (req, res) => {
  res.render('signupPage', {
    title: 'Signup - Nexter ERS',
  });
};

// Process the registration form data
exports.register = async (req, res) => {
  try {
    const { name, email, password, passwordConfirm } = req.body;

    if (password !== passwordConfirm) {
      req.flash('error', 'Passwords do not match');
      return res.redirect('back');
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      req.flash('error', 'User already exists');
      return res.redirect('/auth/login');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({ name, email, password: hashedPassword });

    req.flash('success', 'User created successfully');
    res.redirect('/auth/login');
  } catch (error) {
    req.flash('error', 'Internal server error');
    res.redirect('/auth/register');
  }
};

// Render the login form view
exports.loginForm = (req, res) => {
  res.render('signinPage', {
    title: 'Signin - Nexter ERS',
  });
};

// Process the login form data
exports.login = (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err || !user) {
      req.flash('error', 'Invalid credentials');
      return res.redirect('/auth/login');
    }

    req.logIn(user, (error) => {
      if (error) {
        req.flash('error', 'Error during login');
        return res.redirect('/auth/login');
      }

      const redirectURL = user.isAdmin ? '/admin' : '/employee';
      req.flash('success', 'Logged in successfully');
      res.redirect(redirectURL);
    });
  })(req, res, next);
};

// Logs out the user
exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      req.flash('error', 'Error during logout');
      return res.redirect('/');
    }
    req.flash('success', 'Logged out successfully');
    res.redirect('/');
  });
};

// Middleware to check if the user is an admin
exports.isAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    req.flash('error', 'Only admin can access this page');
    return res.redirect('/auth/login');
  }
  next();
};

// Middleware to check if the user is not an admin
exports.isNotAdmin = (req, res, next) => {
  if (req.user.isAdmin) {
    req.flash('error', 'Admin cannot access this page');
    return res.redirect('/auth/login');
  }
  next();
};
