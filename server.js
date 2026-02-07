const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());

const VERIFY_TOKEN = 'imad2004';
const N8N_WEBHOOK = 'https://n8n-render-e6ze.onrender.com/webhook/5e59b49c-1386-4ea7-baf3-ad052464e0f1';

app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  res.sendStatus(403);
});

// 🔁 Forward POST to n8n
app.post('/webhook', async (req, res) => {
  try {
    await fetch(N8N_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running'));


