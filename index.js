const express = require('express');
const axios = require('axios');
const app = express();

const VALID_KEYS = ["saiyanekam"];
const OWNER_TAG = "@EK4MPREETSINGH ⚡";

// Root page
app.get('/', (req, res) => {
  res.send(`
    <h1>Number Info API</h1>
    <p>To buy access, message <a href="https://t.me/EK4MPREETSINGH">@EK4MPREETSINGH</a></p>
    <p>Usage: /api/num?key=&lt;your_key&gt;&amp;term=&lt;number&gt;</p>
  `);
});

// API route (note the `/api/num`)
app.get('/api/num', async (req, res) => {
  const { key, term } = req.query;

  if (!key || !VALID_KEYS.includes(key)) {
    return res.status(401).json({ success: false, message: "Invalid or missing API key" });
  }
  if (!term) {
    return res.status(400).json({ success: false, message: "Missing 'term' parameter" });
  }

  try {
    const response = await axios.get(
      `https://osintx.info/API/krobetahack.php?key=P6NW6D1&type=mobile&term=${encodeURIComponent(term)}`
    );

    const data = response.data;

    if (data?.data && Array.isArray(data.data)) {
      data.data = data.data.map(item => ({ ...item, owner: OWNER_TAG }));
    } else {
      data.owner = OWNER_TAG;
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ success: false, message: "Upstream API failed", error: err.message });
  }
});

module.exports = app;
