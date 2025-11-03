const { Worker } = require('bullmq');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { sequelize, Summary, Article, User } = require('./db'); // Import DB models
const { connection } = require('./queue'); // Import connection object
require('dotenv').config({ path: '../.env' });

console.log("Worker process starting...");

// --- Initialize Google API ---
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
if (!GOOGLE_API_KEY) {
  console.error("Google API Key not configured.");
  process.exit(1);
}
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// --- Summarize Function (Copied from summaries.js) ---
async function summarizeText(textToSummarize, format, length) {
  // (This is the same summarizeText function from your summaries.js)
  if (!GOOGLE_API_KEY) {
    throw new Error("Google API key not configured.");
  }
  let lengthInstruction = "as a medium-length paragraph";
  if (length === 'Short') lengthInstruction = "in a few concise sentences (around 50 words)";
  if (length === 'Long') lengthInstruction = "as a detailed summary (around 200 words)";
  
  let formatInstruction = format === 'Bullet Points' ? "as a list of key bullet points" : "as a single coherent paragraph";
  
  const fullPrompt = `Your task is to summarize the following text.
  Provide the summary ${formatInstruction}.
  The summary should be ${lengthInstruction}.

  TEXT:\n"""\n${textToSummarize}\n"""\n\nSUMMARY:`;

  try {
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return await response.text();
  } catch (error) {
    console.error("Error calling Google Gemini API:", error);
    if (error.response && error.response.candidates === 0) throw new Error("Content blocked by Google's safety settings.");
    throw new Error("Failed to get summary from Google Gemini API.");
  }
}

// --- Worker Logic ---
const worker = new Worker('summary-jobs', async (job) => {
  console.log(`Processing job ${job.id} for user ${job.data.clerkUserId}`);
  
  const { inputText, subject, format, length, clerkUserId, articleUrl } = job.data;

  try {
    // 1. Call Google Gemini API (The slow part)
    const generatedSummaryContent = await summarizeText(inputText, format, length);

    // 2. Save everything to PostgreSQL
    const [user] = await User.findOrCreate({
      where: { clerkUserId: clerkUserId },
      defaults: { clerkUserId: clerkUserId, email: `user_${clerkUserId}@placeholder.com` }
    });

    const finalArticleUrl = articleUrl || `http://placeholder.summary/${Date.now()}`;

    const [article] = await Article.findOrCreate({
      where: { url: finalArticleUrl },
      defaults: { url: finalArticleUrl, content: inputText },
    });

    await Summary.create({
      content: generatedSummaryContent,
      userId: user.id,
      articleId: article.id,
      subject: subject,
    });

    console.log(`Job ${job.id} COMPLETED`);
    return { success: true, summary: generatedSummaryContent };

  } catch (error) {
    console.error(`Job ${job.id} FAILED:`, error.message);
    throw error; // This will make BullMQ mark the job as 'failed'
  }
}, { connection });

worker.on('completed', (job) => {
  console.log(`Job ${job.id} has completed successfully.`);
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job.id} has failed with error: ${err.message}`);
});

console.log("Worker listening for jobs on 'summary-jobs' queue...");