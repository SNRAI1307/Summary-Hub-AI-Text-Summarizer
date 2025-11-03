require('dotenv').config({ path: '../.env' });

const dbConfig = {
  use_env_variable: 'DATABASE_URL',
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, 
    },
  },
};

module.exports = {
  development: { ...dbConfig },
  test: {
    dialect: 'sqlite',
    storage: ':memory:',
  },
  production: { ...dbConfig },
};