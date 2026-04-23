export default async function handler(req, res) {
  const { message, lang } = req.body;

  const prompt =
    lang === "hi"
      ? `Reply in simple Hindi: ${message}`
      : message;

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=" +
      process.env.GEMINI_API_KEY,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    }
  );

  const data = await response.json();

  const reply =
    data.candidates?.[0]?.content?.parts?.[0]?.text ||
    "Error";

  res.status(200).json({ reply });
}
