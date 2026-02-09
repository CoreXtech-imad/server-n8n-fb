import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// ================================
// 🔹 CONFIG
// ================================
const N8N_WEBHOOK =
  "https://n8n-render-e6ze.onrender.com/webhook/imadtest";

const VERIFY_TOKEN = process.env.VERIFY_TOKEN; // set in Render ENV: imad1234

// ================================
// 🔹 HEALTH CHECK
// ================================
app.get("/", (req, res) => {
  res.send("Express server is running ✅");
});

// ================================
// 🔹 META VERIFICATION
// ================================
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verified by Meta");
    return res.status(200).send(challenge);
  } else {
    console.log("❌ Webhook verification failed");
    return res.sendStatus(403);
  }
});

// ================================
// 🔹 RECEIVE EVENTS & FORWARD TO n8n
// ================================
app.post("/webhook", async (req, res) => {
  // 1️⃣ Respond immediately to Meta
  res.status(200).send("EVENT_RECEIVED");

  // 2️⃣ Forward the event to n8n (async)
  try {
    await fetch(N8N_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });
    console.log("➡ Forwarded event to n8n");
  } catch (err) {
    console.error("❌ Error forwarding to n8n:", err);
  }
});

// ================================
// 🔹 START SERVER
// ================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

