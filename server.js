const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

const port = process.env.PORT || 3000;

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

const connectAndStartServer = async () => {
  try {
    await mongoose.connect(DB);
    console.log('Database connection successful...');
  } catch (error) {
    console.log(error);
  }

  app.listen(port, () => {
    console.log(`App running on port ${port}...`);
  });
};

connectAndStartServer();
