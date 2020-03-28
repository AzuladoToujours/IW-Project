const express = require('express');
const { json, urlencoded, bodyParser } = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const authRouter = require('./resources/auth/auth.routes');
const workerRouter = require('./resources/worker/worker.routes');
const { connect } = require('./utils/dbConnection');

const app = express();
dotenv.config();
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/api', authRouter);
app.use('/api', workerRouter);

const start = async () => {
  try {
    await connect();
    app.listen(process.env.PORT, () => {
      console.log(`REST API on http://localhost:${process.env.PORT}/api`);
    });
  } catch (e) {
    console.error(e);
  }
};

module.exports = { start };
