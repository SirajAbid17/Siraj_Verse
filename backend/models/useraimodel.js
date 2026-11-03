const mongoose = require('mongoose');

const useraiSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  }
}, { timestamps: true });

const userai = mongoose.model('userai', useraiSchema);

module.exports = userai;