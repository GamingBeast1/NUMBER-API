import fetch from "node-fetch";

// Add your valid API keys here
const VALID_KEYS = ["saiyanekam"]; // add as many as you want

export default async function handler(req, res) {
  const { key, term } = req.query;

  // 1️⃣ Validate API key
  if (!key || !VALID_KEYS.includes(key)) {
    return res.status(401).json({
      success: false,
      message: "Please enter valid authentication key"
    });
  }

  // 2️⃣ Validate term
  if (!term) {
    return res.status(400).json({
      success: false,
      message: "Please provide a mobile number"
    });
  }

  try {
    // 3️⃣ Fetch data from original API
    const apiRes = await fetch(`https://osintx.info/API/krobetahack.php?key=P6NW6D1&type=mobile&term=${term}`);
    const data = await apiRes.json();

    // 4️⃣ Inject owner field
    if (data.data && Array.isArray(data.data)) {
      data.data = data.data.map(item => ({
        ...item,
        owner: "@EK4MPREETSINGH" // your custom owner name
      }));
    }

    // 5️⃣ Return modified response
    return res.status(200).json(data);

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong"
    });
  }
}
