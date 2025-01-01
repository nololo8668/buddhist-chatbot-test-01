const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const { pastorSystem } = require('../config/chatConfig');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

router.post('/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;
    const systemMessage = userMessage === "첫 인사" ? pastorSystem.initial : pastorSystem.regular;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: systemMessage
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    res.json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router; 