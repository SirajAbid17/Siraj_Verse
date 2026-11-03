const express = require("express");
const { GoogleGenAI } = require("@google/genai");

const router = express.Router();

let ai = null;

const getAI = () => {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY .env mein nahi mili");
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
};

const geminiChat = async (req, res) => {
  

  try {
    const { message } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message required hai",
      });
    }

    const client = getAI();

    const result = await client.models.generateContent({
      model: "gemini-3.8-flash",
      contents: [{ role: "user", parts: [{ text: message.trim() }] }],
      config: { temperature: 0.7, maxOutputTokens: 2048 },
    });

    const reply = result.text;

    if (!reply) {
      return res.status(502).json({
        success: false,
        message: "Gemini ne empty response diya",
      });
    }

    console.log("AI REPLY:", reply.slice(0, 100));

    return res.status(200).json({ success: true, reply });
  } catch (error) {
    

    let status = 500;
    let message = error?.message || "Gemini request failed";

    if (error?.status === 403) {
      status = 403;
      message =
        "Gemini API key blocked or project not eligible. Check billing/key.";
    } else if (error?.status === 401) {
      status = 401;
      message = "Gemini API key invalid. Regenerate key.";
    } else if (error?.status === 429) {
      status = 429;
      message = "Gemini quota exceeded. Wait or upgrade billing.";
    }

    return res.status(status).json({
      success: false,
      message,
      detail: error?.message,
    });
  }
};

router.post("/ai/chat", geminiChat);

module.exports = router;