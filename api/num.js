const axios = require("axios");

/**
 * Add or remove valid API keys here.
 * Anyone calling this endpoint must provide ?key=<one_of_these>
 * Example keys: "saiyanekam", "paidkey123"
 */
const VALID_KEYS = [
  "saiyanekam"
];

// Owner value to inject into API response
const OWNER_TAG = "@EK4MPREETSINGH";

module.exports = async (req, res) => {
  try {
    const { key, term } = req.query;

    // Auth check
    if (!key || !VALID_KEYS.includes(key)) {
      return res.status(401).json({
        success: false,
        message: "Please enter valid authentication key"
      });
    }

    // term check
    if (!term) {
      return res.status(400).json({
        success: false,
        message: "Please provide a mobile number in 'term' query param"
      });
    }

    // Call the upstream API
    const upstreamUrl = `https://osintx.info/API/krobetahack.php?key=P6NW6D1&type=mobile&term=${encodeURIComponent(term)}`;
    const upstreamResp = await axios.get(upstreamUrl, { timeout: 15000 });
    const data = upstreamResp.data;

    // Inject owner into each item of data array (if present)
    if (data && Array.isArray(data.data)) {
      data.data = data.data.map(item => {
        // ensure we don't overwrite if upstream already has owner — replace anyway per your request
        return Object.assign({}, item, { owner: OWNER_TAG });
      });
    } else if (data && data.data && typeof data.data === "object") {
      // handle object-case (just in case)
      data.data.owner = OWNER_TAG;
    } else {
      // upstream returned unexpected shape — still attach owner top-level
      data.owner = OWNER_TAG;
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error("num.js error:", err?.response?.data || err.message || err);
    return res.status(500).json({
      success: false,
      message: "Internal server error or upstream fetch failed"
    });
  }
};
