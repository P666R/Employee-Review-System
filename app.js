const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const expressLayouts = require('express-ejs-layouts');
const passport = require('passport');
const path = require('path');
const cookieParser = require('cookie-parser');

const passportLocal = require('./config/passportLocal');
const mainRouter = require('./routes/index');

const flash = require('connect-flash');
const customMware = require('./config/middleware');

// Create Express application
const app = express();

app.use(cookieParser());
// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Use EJS layouts
app.use(expressLayouts);

// Set the view engine to EJS and specify the views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configure the session middleware
app.use(
  session({
    // Set the name of the session cookie
    name: 'employee-review-system',
    // Set the secret key used to sign the session ID cookie
    secret: 'my secret key',
    // Set whether to save the session for every request
    resave: false,
    // Set whether to save uninitialized session
    saveUninitialized: false,
    // Configure the session cookie
    cookie: {
      // Set the maximum age of the session cookie
      maxAge: 1000 * 60 * 60 * 24,
    },
    // Configure the session store
    store: MongoStore.create(
      {
        // Set the URL of the MongoDB database
        mongoUrl: process.env.DATABASE.replace(
          '<password>',
          process.env.DATABASE_PASSWORD
        ),
        // Set the name of the collection to store sessions
        collectionName: 'sessions',
        // Set the auto-remove behavior of expired sessions
        autoRemove: 'disabled',
      },
      // Define a callback function to handle any errors during setup
      function (err) {
        console.log(err || 'connect-mongodb setup');
      }
    ),
  })
);

// Initialize Passport for authentication (check no longer required)
app.use(passport.initialize());

// Use Passport session middleware for persistent login sessions
app.use(passport.session());

// Middleware to set the authenticated user on the request object
app.use(passport.setAuthenticatedUser);

// Middleware to use flash messages
app.use(flash());
app.use(customMware.setFlash);

// Use the main router for handling routes starting with '/'
app.use('/', mainRouter);

// Export the Express application
module.exports = app;
