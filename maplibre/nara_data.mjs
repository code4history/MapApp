import fs from "fs-extra";
import proj4 from "proj4";
import * as maptilerClient from '@maptiler/client';

const json = fs.readJSONSync("./NaraOldMap1.json");
const w = parseInt(json.width);
const h = parseInt(json.height);
const tins = json.compiled.tins.forw.features;
const maptilerKey = 'iYbdV7gvJalrUuHckODb';

const gcps = [];

const main = async () => {
  for (let i = 0; i < tins.length; i++) {
    const data = tins[i];
    const abc = ["a", "b", "c"];
    for (let j = 0; j < abc.length; j++) {
      const key = abc[j];
      const forw = data.geometry.coordinates[0][j];
      const bakw = data.properties[key].geom;
      const gcpIndex = data.properties[key].index;
      if (Number.isFinite(gcpIndex) && !gcps[gcpIndex]) {
        const lnglat = proj4("EPSG:3857", "EPSG:4326", bakw);
        const altitude = await maptilerClient.elevation.at(lnglat, {apiKey: maptilerKey});
        gcps[gcpIndex] = {
          forw,
          bakw: lnglat,
          altitude
        }
      }
    }
  }
};

main();