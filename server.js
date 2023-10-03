const mongoose = require('mongoose');
const dotenv = require('dotenv');
const http = require('http');

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(
    'Uncaught Exception! 💥 Shutting down...\n',
    err.name,
    err.message,
  );
  process.exit(1);
});

// Load environment variables from the config.env file
dotenv.config({ path: './config.env' });

// Import the Express app
const app = require('./app');

// Replace the placeholder in the DATABASE connection string with the actual password from the environment variable
const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD,
);

// Set the port number to either the value from the environment variable PORT or 3000
const port = process.env.PORT || 3000;

const server = http.createServer(app);

// Define an asynchronous function to connect to the database and start the server
const connectAndStartServer = async () => {
  try {
    // Connect to the MongoDB database using the DB connection string
    await mongoose.connect(DB);
    console.log('Database connection successful...');
  } catch (err) {
    return console.error(err.name, err.message, '\nExiting...💥');
  }

  // Start the Express app and listen on the specified port
  server.listen(port, () => {
    console.log(`App running on port ${port}...`);
  });
};

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error(
    'Unhandled Rejection! 💥 Shutting down...\n',
    err.name,
    err.message,
  );
  server.close(() => process.exit(1));
});

// Handle SIGTERM signal
process.on('SIGTERM', () => {
  console.log('SIGTERM RECEIVED. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated 💥');
  });
});

// Call the connectAndStartServer function to start the server
connectAndStartServer();
