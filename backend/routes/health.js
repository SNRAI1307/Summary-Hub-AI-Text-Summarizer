const express = require('express');
const router = express.Router();
const { sequelize } = require('../db'); 

router.get('/', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.status(200).json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      database: 'disconnected',
      error: error.message,
    });
  }
});

module.exports = router;