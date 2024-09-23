import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css'; // 追加
import './style.css'; // カスタムスタイルをインポート

// あなたの MapTiler API キーを設定
const maptilerKey = 'iYbdV7gvJalrUuHckODb';

// スライダー要素を取得
const exaggerationSlider = document.getElementById('exaggeration');

// エクザジェレーションの初期値を設定
let currentExaggeration = parseFloat(exaggerationSlider.value);

// 地図の初期化
const map = new maplibregl.Map({
  container: 'map',
  style: `https://api.maptiler.com/maps/hybrid/style.json?key=${maptilerKey}`,
  center: [139.7670, 35.6814],
  zoom: 15,
  pitch: 60,
  maxPitch: 85, // ピッチの最大値を85度に設定
  bearing: -17.6,
  antialias: true
});

map.on('load', () => {
  // Terrain-RGB タイルを追加
  map.addSource('maptiler-terrain', {
    'type': 'raster-dem',
    'url': `https://api.maptiler.com/tiles/terrain-rgb/tiles.json?key=${maptilerKey}`,
    'tileSize': 256,
    'maxzoom': 12
  });

  // Terrain を有効化
  map.setTerrain({ 'source': 'maptiler-terrain', 'exaggeration': currentExaggeration });

  // スカイレイヤーを追加
  map.addLayer({
    'id': 'sky',
    'type': 'sky',
    'paint': {
      'sky-type': 'atmosphere',
      'sky-atmosphere-sun-intensity': 15
    }
  });

  // スライダーのイベントリスナーを設定
  exaggerationSlider.addEventListener('input', (e) => {
    currentExaggeration = parseFloat(e.target.value);
    // Terrain のエクザジェレーションを更新
    map.setTerrain({ 'source': 'maptiler-terrain', 'exaggeration': currentExaggeration });
  });
});

// クリックイベントの設定
map.on('click', (e) => {
  // クリックしたピクセル座標
  const pixel = e.point;

  // クリックした経緯度座標
  const lngLat = e.lngLat;

  // 高度の取得
  const terrain = map.queryTerrainElevation(lngLat, { exaggerated: false });
  const altitude = terrain !== null ? terrain / currentExaggeration : '取得不可';

  // カメラパラメータの取得
  const pitch = map.getPitch();
  const bearing = map.getBearing();
  const zoom = map.getZoom();
  const center = map.getCenter();

  // 情報をまとめる
  const info = `
    <strong>クリックした情報</strong><br/>
    ピクセル座標: (${pixel.x.toFixed(2)}, ${pixel.y.toFixed(2)})<br/>
    経度: ${lngLat.lng.toFixed(6)}<br/>
    緯度: ${lngLat.lat.toFixed(6)}<br/>
    高度: ${altitude.toFixed(2)} m<br/>
    <br/>
    <strong>カメラパラメータ</strong><br/>
    ピッチ: ${pitch.toFixed(2)}°<br/>
    ベアリング: ${bearing.toFixed(2)}°<br/>
    ズーム: ${zoom.toFixed(2)}<br/>
    中心座標: (${center.lng.toFixed(6)}, ${center.lat.toFixed(6)})<br />
    高度強調: ${currentExaggeration.toFixed(2)}
  `;

  // ポップアップを表示
  new maplibregl.Popup()
    .setLngLat(lngLat)
    .setHTML(info)
    .addTo(map);
});
