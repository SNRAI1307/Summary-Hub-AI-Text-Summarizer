// Load .env file from the root
require('dotenv').config({ path: '../.env' }); 

const app = require('./app');
const { sequelize } = require('./db'); // Import the db connection

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Database connection to Neon has been established successfully.');

    app.listen(PORT, ()=> {
      console.log(`Backend server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1); 
    }
}

startServer();