const express = require('express');
const fetch = require('node-fetch'); // make sure package.json has node-fetch
const app = express();

app.use(express.json());

// Your Meta Verify Token
const VERIFY_TOKEN = 'imad2004';

// n8n Production Webhook URL
const N8N_WEBHOOK = 'https://n8n-render-e6ze.onrender.com/webhook/5e59b49c-1386-4ea7-baf3-ad052464e0f1';

// -----------------------------------
// 1️⃣ GET /webhook → Meta Verification
// -----------------------------------
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  console.log('Verification request:', req.query);

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

// -----------------------------------
// 2️⃣ POST /webhook → Forward messages to n8n
// -----------------------------------
app.post('/webhook', async (req, res) => {
  try {
    // Log incoming event (optional)
    console.log('Incoming event:', req.body);

    // Forward to n8n production webhook
    await fetch(N8N_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    res.sendStatus(200);
  } catch (err) {
    console.error('Forwarding error:', err);
    res.sendStatus(500);
  }
});

// -----------------------------------
// Health check
// -----------------------------------
app.get('/', (req, res) => res.send('SERVER OK'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
