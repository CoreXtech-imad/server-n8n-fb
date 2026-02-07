const express = require('express');
const app = express();

app.use(express.json());

// Must match Meta Verify Token
const VERIFY_TOKEN = 'imad2004';

// Facebook / Instagram verification
app.get('/webhook/5e59b49c-1386-4ea7-baf3-ad052464e0f1', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('Webhook verified');
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

// (Optional) POST handler
app.post('/webhook/5e59b49c-1386-4ea7-baf3-ad052464e0f1', (req, res) => {
  console.log('Incoming event:', req.body);
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


