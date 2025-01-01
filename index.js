const express = require('express');
const path = require('path');
require('dotenv').config();

const monkRouter = require('./routes/monkRouter');
const pastorRouter = require('./routes/pastorRouter');

const app = express();
app.use(express.json());

// 정적 파일 설정
app.use('/static', express.static(path.join(__dirname, 'static')));
app.use('/templates', express.static(path.join(__dirname, 'templates')));

// 라우터 설정
app.use('/monk', monkRouter);
app.use('/pastor', pastorRouter);

// 메인 페이지
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'index.html'));
});

// 스님 챗봇 페이지
app.get('/monk', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'monk.html'));
});

// 목사님 챗봇 페이지
app.get('/pastor', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'pastor.html'));
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 