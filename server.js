require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const OpenAI = require("openai");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Utility function to call OpenAI
async function callAI(prompt) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2
  });
  return response.choices[0].message.content;
}

/* ---------------- TRUSTLENS ---------------- */
app.post("/api/analyze-message", async (req, res) => {
  try {
    const { message } = req.body;

    const prompt = `
You are a cybersecurity assistant.

Analyze this message for phishing:
"${message}"

Respond ONLY in JSON:
{
  "risk": "Low | Medium | High",
  "reasons": ["reason1", "reason2"],
  "advice": ["tip1", "tip2"]
}
`;

    const aiResponse = await callAI(prompt);
    res.json(JSON.parse(aiResponse));
  } catch (err) {
    res.status(500).json({ error: "Analysis failed" });
  }
});

/* ---------------- LINK CHECKER ---------------- */
app.post("/api/check-link", async (req, res) => {
  try {
    const { url } = req.body;

    const prompt = `
You are a cybersecurity assistant.

Analyze this URL for potential risks:
"${url}"

Respond ONLY in JSON:
{
  "risk": "Low | Medium | High",
  "indicators": ["indicator1", "indicator2"],
  "action": ["step1", "step2"]
}
`;

    const aiResponse = await callAI(prompt);
    res.json(JSON.parse(aiResponse));
  } catch (err) {
    res.status(500).json({ error: "Link check failed" });
  }
});

/* ---------------- SAFETY SHIELD ---------------- */
app.post("/api/safety-score", async (req, res) => {
  try {
    const { answers } = req.body;

    // simple scoring logic
    let score = 100;
    if (answers.passwordReuse) score -= 20;
    if (answers.publicWifi) score -= 20;
    if (!answers.twoFA) score -= 20;
    if (answers.unknownApps) score -= 20;
    if (answers.shareOTP) score -= 20;

    if (score < 0) score = 0;

    const prompt = `
A student got a digital safety score of ${score}/100.

Their habits:
${JSON.stringify(answers, null, 2)}

Respond ONLY in JSON:
{
  "summary": "short explanation",
  "improvements": ["improvement1", "improvement2", "improvement3"],
  "quickTips": ["tip1", "tip2"]
}
`;

    const aiResponse = await callAI(prompt);

    res.json({
      score,
      ...(JSON.parse(aiResponse))
    });
  } catch (err) {
    res.status(500).json({ error: "Safety analysis failed" });
  }
});

app.listen(PORT, () => {
  console.log(`TrustSphere running on http://localhost:${PORT}`);
});
