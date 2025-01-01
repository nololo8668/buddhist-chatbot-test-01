const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const { monkSystem } = require('../config/chatConfig');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

router.post('/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;
    const systemMessage = userMessage === "첫 인사" ? monkSystem.initial : monkSystem.regular;

    console.log('Received message:', userMessage);

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

    console.log('OpenAI response:', completion.choices[0].message.content);
    res.json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error('Error details:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

module.exports = router; 