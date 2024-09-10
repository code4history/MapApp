<template>
  <div>
    <!-- ヘッダー部分 -->
    <header class="header">
      <button @click="loginWithGoogle">Login with Google</button>
    </header>

    <!-- 地図表示部分 -->
    <div id="map" class="map-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import maplibregl from 'maplibre-gl';

// Googleログイン処理
const loginWithGoogle = () => {
  window.location.href = 'http://localhost:3000/api/auth/google';
};

// 地図の初期化処理
const map = ref(null);  // 地図インスタンスを保持
const geoJsonData = ref(null);  // 取得したGeoJSONデータを保持

onMounted(() => {
  // 地図のインスタンスを作成
  map.value = new maplibregl.Map({
    container: "map", // 地図を表示するためのHTML要素ID
    style: {
      version: 8,
      sources: {
        osm: {
          type: "raster",
          tiles: [
            "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
            "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
            "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
          ],
          tileSize: 256
        }
      },
      layers: [
        {
          id: "osm-tiles",
          type: "raster",
          source: "osm"
        }
      ]
    }, // OSMスタイル
    center: [135.183, 34.839], // 初期表示の緯度経度（経度, 緯度）
    zoom: 14 // ズームレベル
  });

  // 地図がロードされた後にデータを追加
  map.value.on('load', fetchSpatialData);
  map.value.on('moveend', fetchSpatialData);
});

// 空間データをAPIから取得する処理
const fetchSpatialData = async () => {
  const bounds = getMapBounds();
  try {
    // バックエンドAPIから空間データを取得
    const response = await useFetch("http://localhost:3000/api/spatial-data", {
      params: {
        swLng: bounds.sw[0],
        swLat: bounds.sw[1],
        neLng: bounds.ne[0],
        neLat: bounds.ne[1]
      }
    });
    geoJsonData.value = response.data;

    // GeoJSONデータを地図に追加
    await addGeoJsonToMap(geoJsonData.value);
  } catch (error) {
    console.error("Error fetching spatial data:", error);
  }
};

// 地図の表示範囲を取得するメソッド
const getMapBounds = () => {
  const bounds = map.value.getBounds();
  return {
    sw: [bounds.getSouthWest().lng, bounds.getSouthWest().lat], // 南西端の座標
    ne: [bounds.getNorthEast().lng, bounds.getNorthEast().lat]  // 北東端の座標
  };
};

// GeoJSONデータを地図に追加する処理
const addGeoJsonToMap = async (geoJsonData) => {
  const rawGeoJsonData = geoJsonData._rawValue;

  // 既に 'spatialData' というソースが存在する場合、データを更新
  if (map.value.getSource('spatialData')) {
    map.value.getSource('spatialData').setData(rawGeoJsonData);
  } else {
    // 存在しない場合は新しくソースを追加
    map.value.addSource('spatialData', {
      type: 'geojson',
      data: rawGeoJsonData
    });

    // ピンやポリゴンを描画
    map.value.addLayer({
      id: 'spatialData-layer',
      type: 'fill',  // ポリゴンの場合
      source: 'spatialData',
      filter: ['==', ['geometry-type'], 'Polygon'], // Polygon のみフィルタ
      paint: {
        'fill-color': '#888',
        'fill-opacity': 0.4
      }
    });

    map.value.addLayer({
      id: 'spatialData-points',
      type: 'circle',  // ポイントの場合
      source: 'spatialData',
      filter: ['==', ['geometry-type'], 'Point'], // Point のみフィルタ
      paint: {
        'circle-radius': 20,
        'circle-color': '#FF0000'
      }
    });
  }
};






/* import 'maplibre-gl/dist/maplibre-gl.css';
import maplibregl from "maplibre-gl";
import axios from "axios";  // APIを呼び出すためにaxiosを使用
import { ref, onMounted, toRaw } from 'vue';

const loginWithGoogle = () => {
  window.location.href = '/api/auth/signin/google';
}

export default {
  data() {
    return {
      map: null,
      geoJsonData: null,  // 取得したGeoJSONデータを保持
    };
  },
  mounted() {
    // eslint-disable-next-line no-unused-vars
    this.map = new maplibregl.Map({
      container: "map", // 地図を表示するためのHTML要素ID
      style:  {
        "version": 8,
        "sources": {
          "osm": {
            "type": "raster",
            "tiles": [
              "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
              "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
              "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
            ],
            "tileSize": 256
          }
        },
        "layers": [
          {
            "id": "osm-tiles",
            "type": "raster",
            "source": "osm"
          }
        ]
      }, // OSMスタイル
      center: [135.183, 34.839], // 初期表示の緯度経度（経度, 緯度）
      zoom: 14 // ズームレベル
    });

    // 地図がロードされた後にデータを追加
    this.map.on('load', () => {
      this.fetchSpatialData();
    });
    this.map.on('moveend', () => {
        this.fetchSpatialData();
    });
  },
  methods: {
    async fetchSpatialData() {
      const bounds = this.getMapBounds();
      try {
        // バックエンドAPIから空間データを取得
        const response = await axios.get("http://localhost:3000/api/spatial-data", {
          params: {
            swLng: bounds.sw[0],
            swLat: bounds.sw[1],
            neLng: bounds.ne[0],
            neLat: bounds.ne[1]
          }
        });
        this.geoJsonData = response.data;

        // GeoJSONデータを地図に追加
        await this.addGeoJsonToMap(this.geoJsonData);
      } catch (error) {
        console.error("Error fetching spatial data:", error);
      }
    },

    // 地図の表示範囲を取得するメソッド
    getMapBounds() {
      const bounds = this.map.getBounds();
      return {
        sw: [bounds.getSouthWest().lng, bounds.getSouthWest().lat], // 南西端の座標
        ne: [bounds.getNorthEast().lng, bounds.getNorthEast().lat]  // 北東端の座標
      };
    },

    async addGeoJsonToMap(geoJsonData) {
      // Proxyオブジェクトを生のJavaScriptオブジェクトに変換
      const rawGeoJsonData = toRaw(geoJsonData);
      //const image = await this.map.loadImage('https://maplibre.org/maplibre-gl-js/docs/assets/osgeo-logo.png');
      //this.map.addImage('custom-marker', image.data);

      console.log(JSON.stringify(rawGeoJsonData));

      // 既に 'spatialData' というソースが存在する場合、データを更新
      if (this.map.getSource('spatialData')) {
        this.map.getSource('spatialData').setData(rawGeoJsonData);
      } else {
        // 存在しない場合は新しくソースを追加
        this.map.addSource('spatialData', {
          type: 'geojson',
          data: rawGeoJsonData  // 変換後のデータを使用
        });

        // ピンやポリゴンを描画
        this.map.addLayer({
          id: 'spatialData-layer',
          type: 'fill',  // ポリゴンの場合
          source: 'spatialData',
          filter: ['==', ['geometry-type'], 'Polygon'], // Polygon のみフィルタ
          paint: {
            'fill-color': '#888',
            'fill-opacity': 0.4
          }
        });

        this.map.addLayer({
          id: 'spatialData-points',
          type: 'circle',  // ポイントの場合
          source: 'spatialData',
          filter: ['==', ['geometry-type'], 'Point'], // Point のみフィルタ
          paint: {
            'circle-radius': 20,
            'circle-color': '#FF0000'
          }
        });
      }
    }
  }
};*/
</script>

<style>
/* ヘッダーのスタイル */
.header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 50px;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 20px;
  z-index: 1000;
}

.header button {
  padding: 10px 20px;
  background-color: #4285F4;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.header button:hover {
  background-color: #357ae8;
}

/* 地図のスタイル */
.map-container {
  position: absolute;
  top: 50px; /* ヘッダーの高さに合わせて調整 */
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 0;
}
</style>