import axios from "axios";

const VALID_KEYS = ["saiyanekam", "goku123", "vegetaOP"];
const OWNER_TAG = "@EK4MPREETSINGH ⚡";

export default async function handler(req, res) {
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

    // Inject owner
    if (data?.data && Array.isArray(data.data)) {
      data.data = data.data.map(item => ({ ...item, owner: OWNER_TAG }));
    } else if (data?.data && typeof data.data === "object") {
      data.data.owner = OWNER_TAG;
    } else {
      data.owner = OWNER_TAG;
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ success: false, message: "Upstream API failed", error: err.message });
  }
}
