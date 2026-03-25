const mongoose = require('mongoose');
const User = require('./src/models/User');

const MONGODB_URI = 'mongodb+srv://nallappagaridiwakar_db_user:Diwakar630202@cluster0.5jvxqxg.mongodb.net/golfcharity?retryWrites=true&w=majority';

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
