const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from the config.env file
dotenv.config({ path: './config.env' });

// Import the Express app
const app = require('./app');

// Set the port number to either the value from the environment variable PORT or 3000
const port = process.env.PORT || 3000;

// Replace the placeholder in the DATABASE connection string with the actual password from the environment variable
const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

// Define an asynchronous function to connect to the database and start the server
const connectAndStartServer = async () => {
  try {
    // Connect to the MongoDB database using the DB connection string
    await mongoose.connect(DB);
    console.log('Database connection successful...');
  } catch (error) {
    console.log(error);
  }

  // Start the Express app and listen on the specified port
  app.listen(port, () => {
    console.log(`App running on port ${port}...`);
  });
};

// Call the connectAndStartServer function to start the server
connectAndStartServer();
