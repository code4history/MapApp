import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// .env ファイルの内容を読み込む
dotenv.config();

// 環境変数から EMAIL_SERVER をパースする
const smtpUrl = new URL(process.env.EMAIL_SERVER);
const emailUser = decodeURIComponent(smtpUrl.username);
const emailPass = decodeURIComponent(smtpUrl.password);
const emailHost = smtpUrl.hostname;
const emailPort = smtpUrl.port;
console.log(emailUser);
console.log(emailPass);

// SMTP 設定を定義
const transporter = nodemailer.createTransport({
  host: emailHost,
  port: emailPort,
  secure: false, // true for 465, false for other ports (TLS)
  auth: {
    user: emailUser, // .env から取得したユーザー名
    pass: emailPass, // .env から取得したパスワード
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// メールの内容を定義
const mailOptions = {
  from: process.env.EMAIL_FROM, // .env から取得
  to: process.env.EMAIL_TEST_TO, // 宛先メールアドレス
  subject: 'SMTP テストメール',
  text: 'これはSMTPサーバー経由で送信されたテストメールです。',
  html: '<p>これはSMTPサーバー経由で送信されたテストメールです。</p>',
};

// メールを送信
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log('エラーが発生しました: ' + error);
  } else {
    console.log('メールが送信されました: %s', info.messageId);
  }
});