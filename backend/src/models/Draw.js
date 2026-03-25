const mongoose = require('mongoose');

const winnerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  matchCount: {
    type: Number,
    required: true,
  },
  prizePercentage: {
    type: Number,
    required: true,
  },
});

const drawSchema = new mongoose.Schema(
  {
    winningNumbers: {
      type: [Number],
      required: true,
    },
    winners: [winnerSchema],
    isPublished: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: ['random', 'weighted'],
      default: 'random',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Draw', drawSchema);
