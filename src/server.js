const express = require('express');
const { json, urlencoded, bodyParser } = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const authRouter = require('./resources/auth/auth.routes');
const adminRouter = require('./resources/workers/admin/admin.routes');
const workerRouter = require('./resources/workers/worker/worker.routes');
const { connect } = require('./utils/dbConnection');

const app = express();
dotenv.config();
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/api', authRouter);
app.use('/api', workerRouter);
app.use('/api', adminRouter);
app.use(function (err, req, res, next) {
  console.log(err.message);
  if (err.message == 'jwt expired') {
    return res.status(401).json({ error: 'Session or token expired!' });
  }
});

const start = async () => {
  try {
    await connect();
    app.listen(process.env.PORT, () => {
      console.log(`REST API RUNNING`);
    });
  } catch (e) {
    console.error(e);
  }
};

module.exports = { start };
