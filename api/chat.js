export default async function handler(req, res) {
  try {
    const { message, lang } = req.body || {};

    if (!message) {
      return res.status(200).json({ reply: "No message sent" });
    }

    const prompt =
      lang === "hi"
        ? `Reply in simple Hindi: ${message}`
        : message;

    const url =
      "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" +
      process.env.GEMINI_API_KEY;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();

    // 🔍 ALWAYS return details if something is wrong
    if (!response.ok) {
      return res.status(200).json({
        reply: "API Error → " + JSON.stringify(data)
      });
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from AI";

    return res.status(200).json({ reply });

  } catch (err) {
    return res.status(200).json({
      reply: "Server Error → " + err.message
    });
  }
}
