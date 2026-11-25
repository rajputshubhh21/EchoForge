import express from "express";

const app = express();
const PORT = process.env.PORT || 8080;
const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

app.use(express.json({ limit: "20kb" }));
app.use(express.static("public"));

function buildPrompt(idea) {
  return (
    "You are EchoForge. A hackathon builder shares a rough idea. Return ONLY JSON with keys: " +
    "believer (2 sentences, an enthusiastic mentor naming the real strength), " +
    "skeptic (2 sentences, a sharp investor naming the biggest risk and why), " +
    "future (2 sentences, the founder five years later looking back at the one decision that mattered), " +
    "pitch (one punchy sentence under 25 words), " +
    "score (integer 0-100, how clear, original and feasible the idea is; be honest), " +
    "action (one concrete step doable in 24 hours). Keep it plain and specific to the idea.\n\n" +
    `IDEA: ${idea}`
  );
}

app.post("/api/echo", async (req, res) => {
  const idea = String(req.body?.idea || "").trim().slice(0, 1500);

  if (idea.length < 8) return res.status(400).json({ error: "Idea too short" });
  if (!API_KEY) return res.status(500).json({ error: "Server is missing GEMINI_API_KEY" });

  try {
    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": API_KEY },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt(idea) }] }],
        generationConfig: { responseMimeType: "application/json", temperature: 0.8 },
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data?.error?.message || "Gemini request failed");

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    res.json(JSON.parse(text.replace(/```json|```/g, "").trim()));
  } catch (error) {
    console.error(error.message);
    res.status(502).json({ error: "AI request failed" });
  }
});

app.listen(PORT, () => console.log(`EchoForge running at http://localhost:${PORT}`));
