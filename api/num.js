const axios = require("axios");

const VALID_KEYS = ["saiyanekam"];

module.exports = async (req, res) => {
  const { key, term } = req.query;

  if (!key || !VALID_KEYS.includes(key)) {
    return res.status(401).json({
      success: false,
      message: "Please enter valid authentication key"
    });
  }

  if (!term) {
    return res.status(400).json({
      success: false,
      message: "Please provide a mobile number"
    });
  }

  try {
    const response = await axios.get(
      `https://osintx.info/API/krobetahack.php?key=P6NW6D1&type=mobile&term=${term}`
    );

    let data = response.data;

    if (data.data && Array.isArray(data.data)) {
      data.data = data.data.map(item => ({
        ...item,
        owner: "@EK4MPREETSINGH"
      }));
    }

    res.json(data);
  } catch (err) {
    console.error("API Error:", err.response?.data || err.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong"
    });
  }
};
