const express = require('express');
const router = express.Router();
const { Feedback } = require('../db');
const { Resend } = require('resend'); 

const resend = new Resend(process.env.RESEND_API_KEY);

router.post('/', async (req, res) => {
  const clerkUserId = req.auth?.userId || null;
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  try {
    const newFeedback = await Feedback.create({
      name,
      email,
      phone,
      message,
      clerkUserId,
    });

    try {
      await resend.emails.send({
        from: 'Summary Hub <onboarding@resend.dev>',
        to: [email], 
        subject: 'Thank You for Your Feedback!',
        text: `Hi ${name},\n\nThank you for submitting your review. We will look into the suggestion and get back to you later.\n\nBest,\nThe Summary Hub Team`,
        html: `<p>Hi ${name},</p><p>Thank you for submitting your review. We will look into the suggestion and get back to you later.</p><p>Best,<br>The Summary Hub Team</p>`
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
    }
    // ------------------------------------

    res.status(201).json(newFeedback);

  } catch (err) {
    console.error('Feedback Error:', err.message);
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: err.errors.map(e => e.message) });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;