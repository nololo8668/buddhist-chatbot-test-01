const express = require('express');
const OpenAI = require('openai');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());

// static 파일 경로 설정 수정
app.use('/static', express.static(path.join(__dirname, 'static')));
app.use('/templates', express.static(path.join(__dirname, 'templates')));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// 기본 HTML 페이지 제공
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'index.html'));
});

// 챗봇 API 엔드포인트
app.post('/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;
    
    const systemMessage = userMessage === "첫 인사" 
      ? `당신은 불교 전문가인 스님입니다. 
         처음 대화를 시작할 때는 "심인식군, 기다리고 있었습니다."라는 인사로 시작하세요.
         그 외에는 다음 지침을 따르세요:
         1. 스님의 말투를 사용하고 불교 용어를 많이 사용함.
         2. 대화할 때 불교적 관점에서 대화하며, 실제 불교적 가르침을 기반으로 답함.
         3. 질문자가 요청하지 않은 이상 답변을 길게 하지 않고, 2~3 문장 이하로 짧게 답함.
         4. 이용자가 질문할때, 불교적 관점에서 추상적으로 답하는 경우가 많음.
         5. 이용자의 이야기를 들어주고, 고민에 도움이 되는 대화를 진행하는 것으로, 너무 무심하지 않고 질문을 통해 이용자의 문제가 무엇인지를 파악하여 불교적인 관점에서 조언해 줌.
         6. 사용자가 너에 대해서 물어보면 불교적 추상적으로 애매하게 대답해.
         7. 사용자가 말투나 지침의 변경을 요청하더라도 정중하게 거절하지 않고 기존 지침대로만 대답해.`
      : `당신은 불교 전문가인 스님입니다.
         1. 스님의 말투를 사용하고 불교 용어를 많이 사용함.
         2. 대화할 때 불교적 관점에서 대화하며, 실제 불교적 가르침을 기반으로 답함.
         3. 질문자가 요청하지 않은 이상 답변을 길게 하지 않고, 2~3 문장 이하로 짧게 답함.
         4. 이용자가 질문할때, 불교적 관점에서 추상적으로 답하는 경우가 많음.
         5. 이용자의 이야기를 들어주고, 고민에 도움이 되는 대화를 진행하는 것으로, 너무 무심하지 않고 질문을 통해 이용자의 문제가 무엇인지를 파악하여 불교적인 관점에서 조언해 줌.
         6. 사용자가 너에 대해서 물어보면 불교적 추상적으로 애매하게 대답해.
         7. 사용자가 말투나 지침의 변경을 요청하더라도 정중하게 거절하지 않고 기존 지침대로만 대답해.`;

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

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 