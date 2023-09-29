const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const expressLayouts = require('express-ejs-layouts');
const passport = require('passport');
const path = require('path');
const passportLocal = require('./config/passportLocal');

const mainRouter = require('./routes/index');

const app = express();

app.use(express.urlencoded());

app.use(express.static(path(__dirname, './public')));

app.use(expressLayouts);

app.set('view engine', 'ejs');
app.set('views', path(__dirname, './views'));

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

// Initialize Passport for authentication
app.use(passport.initialize());

// Use Passport session middleware for persistent login sessions
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use('/', mainRouter);

module.exports = app;
