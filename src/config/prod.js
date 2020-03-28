const dotenv = require('dotenv');
dotenv.config();

const config = {
  dbUrl: process.env.PROD_DB,
};

module.exports = { config };
