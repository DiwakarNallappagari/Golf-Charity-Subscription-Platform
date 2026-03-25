const mongoose = require('mongoose');
const User = require('./src/models/User');

require('dotenv').config();
const MONGODB_URI = process.env.MONGODB_URI || '<YOUR_MONGODB_URI>';

mongoose.connect(MONGODB_URI)
  .then(async () => {
    // Update all users to have $1,250 in winnings for the mock presentation
    const res = await User.updateMany({}, { $set: { winningsTotal: 1250 } });
    console.log('Successfully added $1,250 winnings to all test users.', res);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
