const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

// Route imports
const authRoutes = require('./routes/authRoutes');
const scoreRoutes = require('./routes/scoreRoutes');
const charityRoutes = require('./routes/charityRoutes');
const drawRoutes = require('./routes/drawRoutes');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// ✅ Basic route
app.get('/', (req, res) => {
  res.send('Golf Charity Subscription Platform API is running...');
});

// ✅ ADD THIS (VERY IMPORTANT)
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/scores', scoreRoutes);
app.use('/api/charities', charityRoutes);
app.use('/api/draws', drawRoutes);

// ❗ Error Handling (must be LAST)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});