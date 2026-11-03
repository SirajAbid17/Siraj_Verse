const mongoose = require("mongoose");

const userschema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  profileimg: {
    type: String,
  },
  coverimg: {
    type: String,
  },
  headline: {
    type: String,
    default: "The greatest act of kindness is to serve humanity without expecting anything in return."
  },
  skills: [{
    type: String
  }],
  education: [{
    college: { type: String },
    degree: { type: String },
    field: { type: String }
  }],
  location: {
    type: String,
    default: "Pakistan"
  },

gender: {
  type: String,
  default: ""
},
  experience: [{
    title: { type: String },
    company: { type: String },
    description: { type: String }
  }],
  connection: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users"
  }]
}, { timestamps: true });

const Users = mongoose.model('Users', userschema);
module.exports = Users;