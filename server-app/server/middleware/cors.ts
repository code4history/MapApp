export default defineEventHandler((event) => {
  // CORS ヘッダーの設定
  setHeader(event, 'Access-Control-Allow-Origin', '*');
  setHeader(event, 'Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  setHeader(event, 'Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
  // Preflight（OPTIONS）リクエストに対応
  if (event.req.method === 'OPTIONS') {
    event.res.statusCode = 204; // No Content
    event.res.end();
  }
});