const axios = require('axios');

// Just an array of valid keys - simple!
const validKeys = ['saiyanekam', 'businesskey', 'testkey', 'vipclient'];

export default async function handler(req, res) {
  const { key, number } = req.query;

  // Check key
  if (!key || !validKeys.includes(key)) {
    return res.json({ error: 'Invalid API key' });
  }

  // Check number
  if (!number) {
    return res.json({ error: 'Number parameter required' });
  }

  try {
    // Fetch from original API
    const response = await axios.get(`https://osintx.info/API/krobetahack.php?key=P6NW6D1&type=mobile&term=${number}`);
    
    // Add your custom field
    const data = response.data;
    if (data.data && data.data[0]) {
      data.data[0].owner = "@Ek4mpreetSingh ⚡";
    }

    res.json(data);
  } catch (error) {
    res.json({ error: 'Failed to fetch data' });
  }
}
