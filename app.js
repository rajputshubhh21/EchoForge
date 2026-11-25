"use strict";

/* ---------- Config ---------- */
const API_URL = "/api/echo";

const EXAMPLES = [
  "A voice assistant that explains government forms in Hindi",
  "An app that turns a school textbook page into a 2-minute quiz",
  "A tool that helps farmers decode crop price news by WhatsApp",
];

const ECHOES = [
  { key: "believer", title: "The Believer", color: "var(--green)" },
  { key: "skeptic", title: "The Skeptic", color: "var(--orange)" },
  { key: "future", title: "Future You, 5 years on", color: "var(--blue)" },
];

/* ---------- DOM ---------- */
const $ = (id) => document.getElementById(id);
const els = {
  idea: $("idea"),
  mic: $("mic"),
  forge: $("forge"),
  examples: $("examples"),
  error: $("error"),
  results: $("results"),
  score: $("score"),
  scoreBar: $("scoreBar"),
  pitch: $("pitch"),
  echoes: $("echoes"),
  action: $("action"),
};

let isLoading = false;

/* ---------- Helpers ---------- */
function showError(message) {
  els.error.textContent = message || "";
}

function setLoading(state) {
  isLoading = state;
  els.forge.disabled = state;
  els.forge.textContent = state ? "Echoing…" : "Forge my idea";
}

function speak(text) {
  if (!("speechSynthesis" in window) || !text) return;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
}

/* ---------- Rendering ---------- */
function createEchoCard({ key, title, color }, data) {
  const card = document.createElement("div");
  card.className = "echo-card";
  card.style.setProperty("--echo-color", color);

  const heading = document.createElement("h3");
  const label = document.createElement("span");
  label.textContent = title;

  const hear = document.createElement("button");
  hear.type = "button";
  hear.className = "btn";
  hear.textContent = "🔊 Hear";
  hear.addEventListener("click", () => speak(data[key]));

  heading.append(label, hear);

  const body = document.createElement("p");
  body.textContent = data[key] || "";

  card.append(heading, body);
  return card;
}

function renderResults(data) {
  const score = Math.max(0, Math.min(100, Number(data.score) || 0));

  els.results.hidden = false;
  els.score.textContent = score;
  els.pitch.textContent = data.pitch || "";
  els.action.textContent = data.action || "";
  els.echoes.replaceChildren(...ECHOES.map((echo) => createEchoCard(echo, data)));

  els.scoreBar.style.width = "0";
  requestAnimationFrame(() => {
    els.scoreBar.style.width = score + "%";
  });

  els.results.scrollIntoView({ behavior: "smooth" });
}

/* ---------- API ---------- */
async function forgeIdea(idea) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idea }),
  });
  const data = await response.json();
  if (!response.ok || data.error) throw new Error(data.error || "Request failed");
  return data;
}

async function handleForge() {
  const idea = els.idea.value.trim();
  showError("");

  if (idea.length < 8) {
    showError("Tell me a bit more about your idea first.");
    return;
  }
  if (isLoading) return;

  setLoading(true);
  try {
    renderResults(await forgeIdea(idea));
  } catch (error) {
    console.error(error);
    showError("Something went wrong. Please try again in a moment.");
  } finally {
    setLoading(false);
  }
}

/* ---------- Voice input ---------- */
function setupVoiceInput() {
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Recognition) return;

  const recognition = new Recognition();
  recognition.lang = "en-IN";
  recognition.interimResults = false;

  const setListening = (on) => {
    els.mic.classList.toggle("is-listening", on);
    els.mic.textContent = on ? "⏹ Stop" : "🎤 Speak";
  };

  recognition.addEventListener("result", (event) => {
    const text = event.results[0][0].transcript;
    els.idea.value = (els.idea.value + " " + text).trim();
  });
  recognition.addEventListener("end", () => setListening(false));

  els.mic.hidden = false;
  els.mic.addEventListener("click", () => {
    if (els.mic.classList.contains("is-listening")) {
      recognition.stop();
    } else {
      setListening(true);
      recognition.start();
    }
  });
}

/* ---------- Init ---------- */
function init() {
  EXAMPLES.forEach((text) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "btn";
    chip.textContent = text;
    chip.addEventListener("click", () => {
      els.idea.value = text;
    });
    els.examples.append(chip);
  });

  els.forge.addEventListener("click", handleForge);
  setupVoiceInput();
}

init();
