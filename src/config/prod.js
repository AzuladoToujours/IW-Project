const dotenv = require('dotenv');
dotenv.config();

const config = {
  dbUrl: process.env.PROD_DB,
  apiUrl: process.env.PROD_URL,
};

module.exports = { config };
