const express = require('express');
const app = express();

app.use(express.raw({ type: 'image/jpeg', limit: '10mb' }));
let latestFrame = null;

app.post('/upload', (req, res) => {
  latestFrame = req.body;
  res.sendStatus(200);
});

app.get('/stream', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'multipart/x-mixed-replace; boundary=boundary',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  });

  const interval = setInterval(() => {
    if (latestFrame) {
      res.write('--boundary\r\nContent-Type: image/jpeg\r\n\r\n');
      res.write(latestFrame);
      res.write('\r\n');
    }
  }, 100); 

  req.on('close', () => clearInterval(interval));
});

app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>도플러 실시간 모니터링</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin:0; background:black; color:white; text-align:center;">
        <h3 style="padding: 10px;">회사 장비 실시간 모니터링</h3>
        <img src="/stream" style="max-width:100%; height:auto;" />
      </body>
    </html>
  `);
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Render 클라우드 중계 서버 가동 완료!');
});