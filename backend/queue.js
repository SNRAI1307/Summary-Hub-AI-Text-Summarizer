const { Queue } = require('bullmq');
const Redis = require('ioredis');
require('dotenv').config({ path: '../.env' }); // Load .env file

const REDIS_URL = process.env.REDIS_URL;
if (!REDIS_URL) {
  throw new Error("Redis URL not configured. Please set REDIS_URL in .env");
}

// Create a new ioredis connection specifically for BullMQ
// (It's safer than sharing the one from summaries.js)
const connection = new Redis(REDIS_URL, {
  maxRetriesPerRequest: null,
});

// Define and export the queue
const summaryQueue = new Queue('summary-jobs', { connection });

console.log("BullMQ queue initialized.");

module.exports = { summaryQueue, connection };