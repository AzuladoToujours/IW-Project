const dotenv = require('dotenv');
dotenv.config();

const config = {
  dbUrl: process.env.DEV_DB,
  apiUrl: process.env.DEV_URL,
};

module.exports = { config };
