const dotenv = require('dotenv');
dotenv.config();

const config = {
  dbUrl: process.env.DEV_DB,
};

module.exports = { config };
