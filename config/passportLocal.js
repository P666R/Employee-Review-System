const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/userModel');

// Configure Passport to use LocalStrategy for authentication
passport.use(
  new LocalStrategy(
    {
      // Specify the field names for the username and password
      usernameField: 'email',
      passwordField: 'password',
    },
    // Define the authentication logic as an asynchronous function
    async (email, password, done) => {
      try {
        // Find a user in the database based on the provided email
        const user = await User.findOne({ email: email });

        // If no user is found, return false indicating invalid credentials
        if (!user) {
          console.log('Invalid username or password');
          return done(null, false);
        }

        // Compare the provided password with the hashed password stored in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);

        // If the passwords do not match, return false indicating invalid credentials
        if (!isPasswordValid) {
          console.log('Invalid username or password');
          return done(null, false);
        }

        // If the authentication is successful, return the user object
        return done(null, user);
      } catch (error) {
        // If an error occurs during the authentication process, return the error
        console.log('Error while finding user in passport', error);
        return done(error);
      }
    }
  )
);

// Serialize the user
passport.serializeUser((user, done) => {
  // Serialize the user object by storing its unique identifier in the session
  done(null, user._id);
});

// Deserialize the user
passport.deserializeUser(async (_id, done) => {
  try {
    // Find the user in the database based on the serialized unique identifier
    const user = await User.findById(_id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Middleware to check if the user is authenticated
passport.checkAuthentication = function (req, res, next) {
  // Check if the user is authenticated
  if (req.isAuthenticated()) {
    // If authenticated, pass control to the next middleware or route handler
    return next();
  }

  // If not authenticated, redirect the user to the login page
  return res.redirect('/users/login');
};

// Middleware to set the authenticated user in the response locals
passport.setAuthenticatedUser = function (req, res, next) {
  // Check if the user is authenticated
  if (req.isAuthenticated()) {
    // If the user is authenticated, assign the user object to the 'user' property in the response locals
    res.locals.user = req.user;
  }
  // Call the next middleware in the stack
  next();
};

module.exports = passport;
