const express = require('express');
const app = express();

// Your secret token (must match n8n Verify Token)
const VERIFY_TOKEN = 'imad2004';

// Handle Facebook GET verification
app.get('/webhook/5e59b49c-1386-4ea7-baf3-ad052464e0f1', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token === VERIFY_TOKEN) {
    console.log('Webhook verified!');
    res.status(200).send(challenge); // Facebook expects the challenge back
  } else {
    res.sendStatus(403);
  }
});

// Optional: forward POST requests to n8n (not strictly needed)
app.use('/webhook/5e59b49c-1386-4ea7-baf052464e0f1', (req, res) => {
  res.send('Forward POSTs to n8n');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
