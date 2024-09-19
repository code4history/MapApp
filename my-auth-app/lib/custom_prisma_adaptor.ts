import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from './prisma'; // Prisma クライアントへのパスを指定
import fetch from 'node-fetch';

// CustomPrismaAdapter の定義
const CustomPrismaAdapter = PrismaAdapter(prisma);

function arrayBufferToBinaryString(arrayBuf: ArrayBuffer) {
  let binaryString = "";
  const bytes = new Uint8Array(arrayBuf);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binaryString += String.fromCharCode(bytes[i]);
  }
  return binaryString
}

async function fetchImageAsDataUrl(url) {
    try {
      // URLから画像を取得
      const response = await fetch(url);
      const buffer = await response.arrayBuffer();
      // 画像をBase64エンコードしてdata URLに変換
      const dataUrl = `data:${response.headers.get('content-type')};base64,${btoa(arrayBufferToBinaryString(buffer))}`;
      return dataUrl;
    } catch (error) {
      console.error('画像の取得に失敗しました:', error);
      return url;
    }
  }

// createUser 関数をオーバーライドして、ユーザー作成時に token.name と token.picture を使用
CustomPrismaAdapter.createUser = async (user) => {
  // userオブジェクトにtokenから得られたnameとpictureを設定
  if (!user.name) {
    user.name = user.defaultName; // jwtコールバックで設定されたデフォルト名を使用
  }
  if (user.image?.match(/^http/)) {
    user.image = await fetchImageAsDataUrl(user.image); // jwtコールバックで設定されたデフォルト画像を使用
  }


  // デフォルトの createUser 処理を呼び出してユーザーを作成
  const newUser = await prisma.user.create({
    data: {
      ...user,
      name: user.name || null,
      image: user.image || null,
    },
  });

  return newUser;
};

export default CustomPrismaAdapter;