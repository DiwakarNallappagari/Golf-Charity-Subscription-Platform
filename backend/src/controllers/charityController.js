const Charity = require('../models/Charity');

// @desc    Get all charities
// @route   GET /api/charities
// @access  Private
const getCharities = async (req, res, next) => {
  try {
    const charities = await Charity.find({});
    res.json(charities);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new charity
// @route   POST /api/charities
// @access  Private/Admin
const createCharity = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    const charityExists = await Charity.findOne({ name });
    if (charityExists) {
      res.status(400);
      throw new Error('Charity already exists');
    }

    const charity = await Charity.create({
      name,
      description,
    });

    res.status(201).json(charity);
  } catch (error) {
    next(error);
  }
};

module.exports = { getCharities, createCharity };
