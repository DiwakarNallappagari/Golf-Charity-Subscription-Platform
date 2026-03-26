const Charity = require('../models/Charity');

const defaultCharities = [
  {
    name: 'Cancer Research UK',
    description: 'Funding life-saving cancer research to help beat cancer sooner.',
  },
  {
    name: 'Doctors Without Borders',
    description: 'Providing medical aid where it is needed most, regardless of race, religion, or politics.',
  },
  {
    name: 'World Wildlife Fund',
    description: 'Protecting nature and reducing the most pressing threats to the diversity of life on Earth.',
  },
  {
    name: 'UNICEF',
    description: 'Working in over 190 countries to save childrens lives, defend their rights, and help them fulfill their potential.',
  },
  {
    name: 'Red Cross',
    description: 'Preventing and alleviating human suffering in the face of emergencies.',
  },
];

const seedCharities = async () => {
  try {
    const count = await Charity.countDocuments();
    if (count === 0) {
      await Charity.insertMany(defaultCharities);
      console.log('✅ Default charities seeded successfully');
    }
  } catch (err) {
    console.error('Charity seeding error:', err.message);
  }
};

module.exports = seedCharities;
