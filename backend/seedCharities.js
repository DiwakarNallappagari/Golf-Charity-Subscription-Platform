const mongoose = require('mongoose');

const CharitySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
});
const Charity = mongoose.models.Charity || mongoose.model('Charity', CharitySchema);

const MONGODB_URI = 'mongodb+srv://nallappagaridiwakar_db_user:Diwakar630202@cluster0.5jvxqxg.mongodb.net/golfcharity?retryWrites=true&w=majority';

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
