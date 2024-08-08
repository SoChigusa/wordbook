const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// 認証情報のパスを指定
const credentials = require('./keys/wordbook-431919-b4af72f10f5d.json');

// スプレッドシートのIDとレンジを指定
const spreadsheetId = '19Ngmq3qELWZR3UWHfbxAq5Xd62eI-0eDMHstwRj406E';
const range = 'words!A:B'; // 必要に応じて変更

const updateWords = async () => {
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  const rows = res.data.values;
  if (!rows.length) {
    console.log('No data found.');
    return;
  }

  // 1行目をスキップするために、スライス操作を使用
  const dataRows = rows.slice(1);

  // 単語データをオブジェクトに変換
  const words = dataRows.map(row => ({
    english: row[0],
    japanese: row[1],
  }));

  // words.json ファイルのパスを指定
  const filePath = path.join(__dirname, 'data', 'words.json');

  // JSON ファイルに書き込む
  fs.writeFileSync(filePath, JSON.stringify(words, null, 2));
  console.log('words.json has been updated');
};

updateWords().catch(console.error);