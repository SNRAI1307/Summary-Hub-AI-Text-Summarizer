const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/clerkAuth');
// Make sure User and sequelize are imported from your db
const { Summary, Article, User, sequelize } = require('../db'); 
const { Op } = require('sequelize'); // Import Op for 'in' query
const { summaryQueue } = require('../queue');
const { createHash } = require('crypto');
const Redis = require('ioredis');

// --- Redis Client (This is for the Day 16 Caching, we can leave it) ---
const REDIS_URL = process.env.REDIS_URL;
if (!REDIS_URL) {
  console.error("Redis URL not configured. Please set REDIS_URL in .env");
}
const redis = new Redis(REDIS_URL);
// ---------------------------------

// Helper function
const generateSubject = (text) => {
  const firstWords = text.trim().split(/\s+/).slice(0, 5).join(' ');
  return firstWords ? `${firstWords}...` : 'Untitled Summary';
};

// --- POST Route (Unchanged) ---
router.post('/', requireAuth, async (req, res) => {
  // ... (your existing POST route code is unchanged)
  const { articleUrl, textToSummarize, format, length } = req.body;
  const clerkUserId = req.auth.userId;

  try {
    const inputText = textToSummarize;
    if (!inputText) {
         return res.status(400).json({ error: 'Input text is missing.' });
    }
    
    const subject = generateSubject(inputText);

    const jobData = {
      inputText,
      subject,
      format,
      length,
      clerkUserId,
      articleUrl: articleUrl || null
    };
    
    const jobId = createHash('sha256').update(JSON.stringify(jobData)).digest('hex');

    await summaryQueue.add('summarize', jobData, { jobId: jobId });

    res.status(202).json({ 
      message: "Summary generation has been queued.",
      jobId: jobId 
    });

  } catch (err) {
    console.error('Queue Error:', err.message);
    res.status(500).json({ error: 'Failed to add summary job to queue.' });
  }
});


// --- GET Route (Unchanged) ---
router.get('/', requireAuth, async (req, res) => {
   // ... (your existing GET route code is unchanged)
   const clerkUserId = req.auth.userId;
   try {
     const user = await User.findOne({ where: { clerkUserId: clerkUserId }});
     if (!user) {
       return res.json([]);
     }
     const summaries = await Summary.findAll({
       where: { userId: user.id },
       include: [
         { model: Article, as: 'article', attributes: ['id', 'url'] },
       ],
       order: [['createdAt', 'DESC']],
     });
     res.json(summaries);
   } catch (err) {
     console.error('Get Summaries Error:', err.message);
     res.status(500).send('Server Error');
  }
});

// --- ✨ NEW: DELETE Route for a Batch of Selected Summaries ---
router.delete('/', requireAuth, async (req, res) => {
  const clerkUserId = req.auth.userId;
  const { ids } = req.body; // Expecting { ids: [1, 2, 3] }

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: 'An array of summary IDs is required.' });
  }

  try {
    // 1. Find the user by their Clerk ID
    const user = await User.findOne({ where: { clerkUserId: clerkUserId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // 2. Delete all summaries that match the IDs AND the userId
    const deletedCount = await Summary.destroy({
      where: {
        userId: user.id, // Security check!
        id: {
          [Op.in]: ids, // Sequelize's "IN" operator
        },
      },
    });

    if (deletedCount === 0) {
      return res.status(404).json({ error: 'No matching summaries found to delete.' });
    }

    res.status(200).json({ message: `Successfully deleted ${deletedCount} summaries.` });

  } catch (err) {
    console.error('Batch Delete Summary Error:', err.message);
    res.status(500).send('Server Error');
  }
});

// --- DELETE Route for a Single Summary (Unchanged) ---
router.delete('/:id', requireAuth, async (req, res) => {
  // ... (your existing DELETE /:id route code is unchanged)
  const clerkUserId = req.auth.userId;
  const { id } = req.params;

  try {
    const user = await User.findOne({ where: { clerkUserId: clerkUserId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const summary = await Summary.findOne({
      where: {
        id: id,
        userId: user.id, 
      },
    });

    if (!summary) {
      return res.status(404).json({ error: 'Summary not found or you do not have permission.' });
    }

    await summary.destroy();
    res.status(200).json({ message: 'Summary deleted successfully.' });

  } catch (err) {
    console.error('Delete Summary Error:', err.message);
    res.status(500).send('Server Error');
  }
});

// --- DELETE Route for ALL User Summaries (Unchanged) ---
router.delete('/all', requireAuth, async (req, res) => {
  // ... (your existing DELETE /all route code is unchanged)
  const clerkUserId = req.auth.userId;

  try {
    const user = await User.findOne({ where: { clerkUserId: clerkUserId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const deletedCount = await Summary.destroy({
      where: {
        userId: user.id,
      },
    });

    res.status(200).json({ message: `Successfully deleted ${deletedCount} summaries.` });

  } catch (err) {
    console.error('Delete All Summaries Error:', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;