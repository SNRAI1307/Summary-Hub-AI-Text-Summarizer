const express = require('express');
const cors = require('cors');
const { ClerkExpressWithAuth } = require('@clerk/clerk-sdk-node');

const app = express();

app.use(cors());
app.use(express.json());
app.use(ClerkExpressWithAuth());

const healthRoutes = require('./routes/health');
const summaryRoutes = require('./routes/summaries');
const feedbackRoutes = require('./routes/feedback'); // 1. Import new route

app.use('/health', healthRoutes);
app.use('/summaries', summaryRoutes);
app.use('/feedback', feedbackRoutes); 

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Stack 5 API' });
});

module.exports = app;