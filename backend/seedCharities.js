const mongoose = require('mongoose');

const CharitySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
});
const Charity = mongoose.models.Charity || mongoose.model('Charity', CharitySchema);

require('dotenv').config();
const MONGODB_URI = process.env.MONGODB_URI || '<YOUR_MONGODB_URI>';

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('MongoDB connected');
    const count = await Charity.countDocuments();
    if (count === 0) {
      await Charity.insertMany([
        { name: 'Golfers Against Cancer', description: 'Funding cancer research through golf.' },
        { name: 'World Wildlife Fund', description: 'Wildlife conservation.' },
        { name: 'The First Tee', description: 'Impact the lives of young people through golf.' },
        { name: 'Red Cross', description: 'Disaster relief and humanitarian aid.' }
      ]);
      console.log('Seeded robust charities for the platform!');
    } else {
      console.log('Charities already exist.');
    }
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
