const mongoose = require('mongoose');
const { v1: uuidv1 } = require('uuid');
const crypto = require('crypto');
const { ObjectId } = mongoose.Schema;

const workerSchema = new mongoose.Schema({
  names: {
    type: String,
    trim: true,
    required: true,
  },
  last_names: {
    type: String,
    trim: true,
    required: true,
  },
  mobile: {
    type: String,
    trim: true,
    required: true,
  },
  dni: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  birthday: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  hashed_password: {
    type: String,
    required: true,
  },
  salt: String,
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: Date,
  role: {
    type: String,
    default: 'worker',
  },
  salary: {
    type: String,
    default: 0,
  },
  photo: {
    type: String,
    default:
      'https://iw-project.s3.us-east-2.amazonaws.com/workers-photos/defaultpicture.png',
    trim: true,
  },
  contract: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    default: 'HIRED',
  },
  created_by: {
    type: ObjectId,
    ref: 'Worker',
  },
  resetPasswordLink: {
    data: String,
    default: '',
  },
});

//virtual field
workerSchema
  .virtual('password')
  .set(function (password) {
    //Create a temporary variable
    this._password = password;
    //generate a timestamp
    this.salt = uuidv1();
    //encrypt the password
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this.password;
  });

//methods
workerSchema.methods = {
  authenticate: function (password) {
    return this.encryptPassword(password) === this.hashed_password;
  },

  encryptPassword: function (password) {
    if (!password) return '';
    try {
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex');
    } catch (err) {
      return '';
    }
  },
};

module.exports = mongoose.model('Worker', workerSchema);
