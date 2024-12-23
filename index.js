const express = require('express');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static('static'));
app.use(express.static('templates'));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// 기본 HTML 페이지 제공
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/templates/index.html');
});

// 챗봇 API 엔드포인트
app.post('/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "당신은 불교 전문가입니다. 불교에 대한 질문에 친절하게 답변해주세요."
        },
        {
          role: "user",
          content: userMessage
        }
      ],
    });

    res.json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 