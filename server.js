import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// ✅ YOUR n8n PRODUCTION WEBHOOK
const N8N_WEBHOOK =
  "https://n8n-render-e6ze.onrender.com/webhook/5e59b49c-1386-4ea7-baf3-ad052464e0f1";

// Health check
app.get("/", (req, res) => {
  res.send("Express server is running ✅");
});

// 🔥 MAIN WEBHOOK
app.post("/webhook", async (req, res) => {
  // 1️⃣ Respond immediately (Meta requires this)
  res.status(200).send("EVENT_RECEIVED");

  // 2️⃣ Forward to n8n (async)
  try {
    await fetch(N8N_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });
  } catch (err) {
    console.error("❌ Error forwarding to n8n:", err);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
