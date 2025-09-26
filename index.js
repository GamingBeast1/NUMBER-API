const express = require('express');
const axios = require('axios');
const app = express();

// Your valid API keys
const VALID_KEYS = ["saiyanekam", "goku123", "vegetaOP"];
const OWNER_TAG = "@EK4MPREETSINGH ⚡";

// Landing page
app.get('/', (req, res) => {
  res.send(`
    <h1>Number Info API</h1>
    <p>To buy access, message <a href="https://t.me/EK4MPREETSINGH">@EK4MPREETSINGH</a> on Telegram.</p>
    <p>Usage: /num?key=&lt;your_key&gt;&amp;term=&lt;number&gt;</p>
  `);
});

// Main API route
app.get('/num', async (req, res) => {
  const { key, term } = req.query;

  // Check key
  if (!key || !VALID_KEYS.includes(key)) {
    return res.status(401).json({ success: false, message: "Invalid or missing API key" });
  }

  // Check number parameter
  if (!term) {
    return res.status(400).json({ success: false, message: "Missing 'term' parameter" });
  }

  try {
    // Fetch data from your upstream API
    const response = await axios.get(
      `https://osintx.info/API/krobetahack.php?key=P6NW6D1&type=mobile&term=${encodeURIComponent(term)}`
    );

    const data = response.data;

    // Inject owner info into response
    if (data?.data && Array.isArray(data.data)) {
      data.data = data.data.map(item => ({ ...item, owner: OWNER_TAG }));
    } else if (data?.data && typeof data.data === "object") {
      data.data.owner = OWNER_TAG;
    } else {
      data.owner = OWNER_TAG;
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Upstream API failed",
      error: err.message
    });
  }
});

module.exports = app;
