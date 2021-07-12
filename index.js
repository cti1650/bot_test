const https = require('https');
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const app = express();
const PORT = process.env.PORT || 3000;
const TOKEN = process.env.LINE_ACCESS_TOKEN;

const supabaseUrl = 'https://zpqdwrwmgualomsihngl.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

let { data: test, error } = await supabase
  .from('test')
  .select('*')

console.log(data);

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get('/', (req, res) => {
  res.sendStatus(200);
});

app.post('/webhook', function (req, res) {
  res.send('HTTP POST request sent to the webhook URL!');
  // ユーザーがボットにメッセージを送った場合、返信メッセージを送る
  if (req.body.events[0].type === 'message') {
    // 文字列化したメッセージデータ
    const dataString = JSON.stringify({
      replyToken: req.body.events[0].replyToken,
      messages: [
        {
          type: 'text',
          text: 'Hello, user',
        },
        {
          type: 'text',
          text: 'May I help you?',
        },
        {
          type: 'text',
          text: '変わってる？',
        },
        {
          type: 'text',
          text: '聞こえているか？',
        },
      ],
    });

    // リクエストヘッダー
    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + TOKEN,
    };

    // リクエストに渡すオプション
    const webhookOptions = {
      hostname: 'api.line.me',
      path: '/v2/bot/message/reply',
      method: 'POST',
      headers: headers,
      body: dataString,
    };

    // リクエストの定義
    const request = https.request(webhookOptions, (res) => {
      res.on('data', (d) => {
        process.stdout.write(d);
      });
    });

    // エラーをハンドル
    request.on('error', (err) => {
      console.error(err);
    });

    // データを送信
    request.write(dataString);
    request.end();
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
