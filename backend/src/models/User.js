const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    charityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Charity',
    },
    charityPercentage: {
      type: Number,
      default: 10,
      min: 10,
    },
    winningsTotal: {
      type: Number,
      default: 0,
    },
    subscription: {
      status: {
        type: String,
        enum: ['active', 'expired', 'cancelled', 'none'],
        default: 'none',
      },
      plan: {
        type: String,
        enum: ['monthly', 'yearly', 'none'],
        default: 'none',
      },
      expiryDate: {
        type: Date,
      },
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password using bcrypt
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
