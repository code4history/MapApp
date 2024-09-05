import mysql from 'mysql2/promise';
import 'dotenv/config';
import { getQuery } from 'h3';  // h3 から getQuery をインポート

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const swLng = parseFloat(query.swLng as string); // 西 (経度)
  const swLat = parseFloat(query.swLat as string); // 南 (緯度)
  const neLng = parseFloat(query.neLng as string); // 東 (経度)
  const neLat = parseFloat(query.neLat as string); // 北 (緯度)

  // バウンディングボックスを作成
  const bbox = `POLYGON((${swLat} ${swLng}, ${swLat} ${neLng}, ${neLat} ${neLng}, ${neLat} ${swLng}, ${swLat} ${swLng}))`;
  console.log(bbox);

  const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3390,
    user: 'root',
    password: process.env.MYSQL_PW,
    database: 'spatial_app'
  });

  // MySQLでバウンディングボックス内のデータを取得
  const [rows] = await connection.query(`
    SELECT id, name, address, type, ST_AsGeoJSON(geom) as geom FROM spatial_data
    WHERE ST_Intersects(geom, ST_GeomFromText(?, 4326))
  `, [bbox]);

  await connection.end();

  return {
    type: "FeatureCollection",
    features: (rows as any[]).map(item => {
      const geometry = item.geom;
      const properties = item;
      delete properties.geom;
      return {
        type: "Feature", 
        properties,
        geometry
      };
    })
  };
});