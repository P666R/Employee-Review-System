const passport = require('passport');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');

exports.registerForm = (req, res) => {
  res.render('auth/register');
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, passwordConfirm } = req.body;

    if (password !== passwordConfirm) {
      console.log('Passwords do not match');
      return res.redirect('/auth/register');
    }

    const user = await User.findOne({ email });

    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 12);
      await User.create({ name, email, password: hashedPassword });
    } else {
      console.log('User already exists');
      return res.redirect('/auth/login');
    }

    console.log('User created successfully');
    res.redirect('/auth/login');
  } catch (error) {
    console.log('error creating user', error);
    res.redirect('/auth/register');
  }
};

exports.loginForm = (req, res) => {
  res.render('auth/login');
};

exports.login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err || !user) {
      console.log(err || 'Invalid credentials');
      return res.redirect('/auth/login');
    }

    req.logIn(user, (err) => {
      if (err) {
        console.log(err);
        return res.redirect('/auth/login');
      }

      const redirectURL = user.isAdmin ? '/employee' : '/admin';
      return res.redirect(redirectURL);
    });
  })(req, res, next);
};

exports.logout = (req, res) => {
  req.logout();
  res.redirect('/auth/login');
};
