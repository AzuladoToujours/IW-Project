const mongoose = require('mongoose');
const options = require('../config/index');

const connect = (
  url = options.configs.dbUrl,
  opts = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  }
) => {
  return mongoose.connect(url, {
    ...opts,
  });
};

module.exports = { connect };
