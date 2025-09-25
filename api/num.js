import fetch from "node-fetch";

const VALID_KEYS = ["saiyanekam"]; // add your keys

export default async function handler(req, res) {
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
    const apiRes = await fetch(
      `https://osintx.info/API/krobetahack.php?key=P6NW6D1&type=mobile&term=${term}`
    );
    const data = await apiRes.json();

    // Add custom owner field
    if (data.data && Array.isArray(data.data)) {
      data.data = data.data.map(item => ({
        ...item,
        owner: "@EK4MPREETSINGH"
      }));
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong"
    });
  }
}
