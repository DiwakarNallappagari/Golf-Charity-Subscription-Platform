const mongoose = require('mongoose');

const charitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a charity name'],
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    totalContributed: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Charity', charitySchema);
