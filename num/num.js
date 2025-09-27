const axios = require('axios');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { key, number } = req.query;

    // Validate API key
    if (!key || key !== 'saiyanekam') {
      return res.status(401).json({ 
        error: 'Invalid API key', 
        message: 'Please contact @EK4MPREETSINGH on Telegram to get a valid API key' 
      });
    }

    // Validate phone number
    if (!number) {
      return res.status(400).json({ 
        error: 'Phone number required',
        usage: '/api/num?key=saiyanekam&number=9914348638'
      });
    }

    // Validate phone number format (Indian mobile numbers)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(number)) {
      return res.status(400).json({ 
        error: 'Invalid phone number format',
        message: 'Please provide a valid 10-digit Indian mobile number'
      });
    }

    // Fetch data from original API
    const baseUrl = `https://osintx.info/API/krobetahack.php?key=P6NW6D1&type=mobile&term=${number}`;
    
    const response = await axios.get(baseUrl, {
      timeout: 10000 // 10 second timeout
    });

    // Check if data is valid
    if (!response.data || !response.data.data) {
      return res.status(404).json({ 
        error: 'No data found',
        message: 'No information available for this number'
      });
    }

    // Customize the response
    const originalData = response.data.data[0];
    const customizedResponse = {
      success: true,
      data: {
        ...originalData,
        owner: "@Ek4mpreetSingh ⚡",
        api_provider: "Custom API Service",
        timestamp: new Date().toISOString(),
        credits: "Powered by Custom API"
      },
      metadata: {
        version: "1.0",
        source: "Custom API Wrapper",
        contact: "@EK4MPREETSINGH on Telegram"
      }
    };

    // Send customized response
    res.status(200).json(customizedResponse);

  } catch (error) {
    console.error('API Error:', error);

    // Handle different types of errors
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      return res.status(503).json({ 
        error: 'Service temporarily unavailable',
        message: 'Please try again later'
      });
    }

    if (error.response) {
      // Original API returned an error
      return res.status(502).json({ 
        error: 'Upstream API error',
        message: 'The data source is currently unavailable'
      });
    }

    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Something went wrong. Please contact support.'
    });
  }
};
