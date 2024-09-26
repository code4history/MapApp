// optimizeCameraParams.mjs
import proj4 from 'proj4';
import { data } from './data.mjs';  // データを適切にインポート

// プロジェクションの定義
const wgs84 = 'EPSG:4326';
const webMercator = 'EPSG:3857';

proj4.defs([
  [
    'EPSG:3857',
    '+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 ' +
      '+datum=WGS84 +units=m +no_defs'
  ]
]);

function lonLatToWebMercator(lon, lat) {
  return proj4(wgs84, webMercator, [lon, lat]);
}

// 射影関数の実装
function projectPoint(point, cameraParams) {
  const {
    pitch,
    bearing,
    zoom,
    centerLon,
    centerLat,
    exaggeration
  } = cameraParams;

  const imageWidth = 9618;
  const imageHeight = 6786;

  const [mercX, mercY] = lonLatToWebMercator(point.longitude, point.latitude);
  const [centerX, centerY] = lonLatToWebMercator(centerLon, centerLat);

  const dx = mercX - centerX;
  const dy = mercY - centerY;
  const dz = point.elevation * exaggeration;

  const radPitch = (pitch * Math.PI) / 180;
  const radBearing = (-bearing * Math.PI) / 180;

  const cosPitch = Math.cos(radPitch);
  const sinPitch = Math.sin(radPitch);
  const cosBearing = Math.cos(radBearing);
  const sinBearing = Math.sin(radBearing);

  const x1 = dx * cosBearing - dy * sinBearing;
  const y1 = dx * sinBearing + dy * cosBearing;
  const z1 = dz;

  const x2 = x1;
  const y2 = y1 * cosPitch - z1 * sinPitch;
  const z2 = y1 * sinPitch + z1 * cosPitch;

  const scale = 256 * Math.pow(2, zoom);
  const pixelX = (x2 / scale) + (imageWidth / 2);
  const pixelY = -(z2 / scale) + (imageHeight / 2);

  return [pixelX, pixelY];
}

// 評価関数（誤差関数）の定義
function reprojectionError(theta) {
  const cameraParams = {
    pitch: theta[0],
    bearing: theta[1],
    zoom: theta[2],
    centerLon: theta[3],
    centerLat: theta[4],
    exaggeration: theta[5]
  };

  const errors = data.map(point => {
    const [projectedX, projectedY] = projectPoint(point, cameraParams);
    const observedX = point.x;
    const observedY = point.y;

    return [
      (observedX - projectedX),
      (observedY - projectedY)
    ];
  }).flat();

  // 残差の二乗和を返す
  const sumOfSquares = errors.reduce((sum, value) => sum + value * value, 0);
  return sumOfSquares;
}

// パラメータの範囲とステップの設定
const paramRanges = {
  pitch: { min: 10, max: 45, step: 2.5 },          // ピッチ角度（度）
  bearing: { min: 0, max: 90, step: 5 },   // ベアリング（度）
  zoom: { min: 15, max: 18, step: 0.1 },           // ズームレベル
  centerLon: { min: 135.824, max: 135.832, step: 0.001 }, // 中心経度
  centerLat: { min: 34.677, max: 34.682, step: 0.001 },   // 中心緯度
  exaggeration: { min: 0.5, max: 5.0, step: 0.5 }    // 高度強調度合い
};
//34.682012772306116, 135.83176725714657
//34.67714040242551, 135.82429964448536
// 各パラメータの値のリストを生成
function generateValues(min, max, step) {
  const values = [];
  for (let v = min; v <= max; v += step) {
    values.push(v);
  }
  return values;
}

// 全ての組み合わせを生成
const pitches = generateValues(paramRanges.pitch.min, paramRanges.pitch.max, paramRanges.pitch.step);
const bearings = generateValues(paramRanges.bearing.min, paramRanges.bearing.max, paramRanges.bearing.step);
const zooms = generateValues(paramRanges.zoom.min, paramRanges.zoom.max, paramRanges.zoom.step);
const centerLons = generateValues(paramRanges.centerLon.min, paramRanges.centerLon.max, paramRanges.centerLon.step);
const centerLats = generateValues(paramRanges.centerLat.min, paramRanges.centerLat.max, paramRanges.centerLat.step);
const exaggerations = generateValues(paramRanges.exaggeration.min, paramRanges.exaggeration.max, paramRanges.exaggeration.step);

// グリッドサーチの実行
let bestTheta = null;
let bestError = Infinity;

const allNum = pitches.length * bearings.length * zooms.length * centerLons.length * centerLats.length *exaggerations.length;
console.log(`Full cases ${allNum}`);
let counter = 0;
for (const pitch of pitches) {
  for (const bearing of bearings) {
    for (const zoom of zooms) {
      for (const centerLon of centerLons) {
        for (const centerLat of centerLats) {
          for (const exaggeration of exaggerations) {
            counter++;
            const theta = [pitch, bearing, zoom, centerLon, centerLat, exaggeration];
            const error = reprojectionError(theta);

            if (error < bestError) {
              bestError = error;
              bestTheta = theta.slice(); // 配列をコピー
              console.log(`New best: Num:${counter}, ${bestError}, ${bestTheta}`);
            }
          }
        }
      }
    }
  }
}

// 最適化されたパラメータの表示
console.log('最適化されたカメラパラメータ:', {
  pitch: bestTheta[0],
  bearing: bestTheta[1],
  zoom: bestTheta[2],
  centerLon: bestTheta[3],
  centerLat: bestTheta[4],
  exaggeration: bestTheta[5]
});
console.log('最小誤差:', bestError);
