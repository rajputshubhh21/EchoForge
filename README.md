# 🔊 EchoForge

**Speak a rough idea. Hear it echoed back from three minds. Walk away with a sharper pitch.**

Built for the **PromptWars × Echo Engineer AI Vibeathon 2026**.

## The problem

Most early ideas fail because the builder only hears their own opinion. Honest feedback from a mentor, a skeptical investor and your own future self normally takes days, and beginners often have no access to it at all.

## The solution

EchoForge gives that feedback in seconds.

| Output | What it gives you |
|---|---|
| 🟢 **The Believer** | The real strength of your idea |
| 🟠 **The Skeptic** | The biggest risk, and why |
| 🔵 **Future You (5 years on)** | The one decision that mattered |
| 📊 **Echo Score (0–100)** | How clear, original and feasible the idea is |
| ✨ **Sharpened pitch** | One punchy sentence |
| ⏱️ **24-hour action** | One concrete next step |

Every echo can be played aloud.

## Tech stack

- **Frontend:** HTML, CSS and vanilla JavaScript (no framework, no build step)
- **Backend:** Node.js and Express
- **AI:** Google Gemini API
- **Voice:** Web Speech API (speech recognition and speech synthesis)

## Project structure

```
echoforge/
├── public/
│   ├── index.html    # page structure
│   ├── style.css     # styles (light and dark mode)
│   └── app.js        # UI logic, voice input, API calls
├── server.js         # Express server and Gemini proxy
├── package.json
├── .env.example      # copy to .env and add your key
└── LICENSE
```

## Getting started

You need Node.js 20.6 or newer and a Gemini API key from [Google AI Studio](https://aistudio.google.com/).

```bash
git clone <your-repo-url>
cd echoforge
npm install
cp .env.example .env      # then put your key in .env
npm run dev
```

Open http://localhost:8080.

## Deploy to Google Cloud Run

```bash
gcloud run deploy echoforge --source . --region asia-south1 \
  --allow-unauthenticated --set-env-vars GEMINI_API_KEY="your-key-here"
```

## Configuration

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | Yes | Your Gemini API key. Never commit it. |
| `GEMINI_MODEL` | No | Defaults to `gemini-2.5-flash`. Change it if that model is retired. |
| `PORT` | No | Defaults to `8080`. |

## Notes

- Voice input works in Chromium browsers (Chrome, Edge).
- The API key stays on the server and is never sent to the browser.

## Roadmap

- [ ] Save and compare ideas over time
- [ ] Multilingual echoes (Hindi and other regional languages)
- [ ] Team mode: everyone hears the same echoes live
- [ ] Shareable result card

## Responsible AI

The Skeptic persona is built in on purpose so the tool doesn't just flatter users, and the score is meant to be honest rather than inflated. EchoForge does not store personal data.

## License

MIT, see [LICENSE](LICENSE).
