import React, { useState } from "react";
import "leaflet/dist/leaflet.css";
import "./index.css";
import Map from "./map.jsx";

/** 小工具：把 src/assets 下的文件名转换成打包后的 URL */
const asset = (file) => new URL(`./assets/${file}`, import.meta.url).href;

/** 景点与美食：把原来的 src:'/image/xxx.JPG' 改为 file:'xxx.JPG' */
const scenicPhotos = [
  { name: "Bodie Island Lighthouse", file: "lh.JPG", date: "Sep-3-2025", lat: 35.82612105339161, lng: -75.5640299888405 }, 
  { name: "Jockey's Ridge State Park", file: "park2.JPG", date: "Sep-3-2025", lat: 35.985186058174605, lng: -75.64505415873117 },
  { name: "Springer's Point Preserve", file: "ha.JPG", date: "Sep-4-2025", lat: 35.1066657323233, lng: -75.98647426996197 },
  { name: "Elizabethan Gardens", file: "garden.JPG", date: "Sep-5-2025", lat: 35.94375907353072, lng: -75.71327634015823 },
];

const foodPhotos = [
  { name: "Ocracoke Fudge & Ice Cream Shop", file: "icecream.JPG", date: "Sep-4-2025", lat: 35.11424914560601, lng: -75.98337313415955 },
  { name: "SmacNally’s Waterfront Bar & Grill", file: "burger.JPG", date: "Sep-4-2025", lat: 35.115223031106076, lng: -75.9845259027621 },
  { name: "Blue Water Grill & Raw Bar", file: "seafood.JPG", date: "Sep-5-2025", lat: 35.901932241784685, lng: -75.6442879804703 },
];

export default function App() {
  // 地图点数据（跟你原来一致）
  const scenicSpots = scenicPhotos.map(({ id, name, lat, lng }) => ({
    id: id ?? `s-${name}`,
    name,
    lat,
    lng,
    type: "sight",
  }));

  const foodSpots = foodPhotos.map(({ id, name, lat, lng }) => ({
    id: id ?? `f-${name}`,
    name,
    lat,
    lng,
    type: "food",
  }));

  const visitedSpots = [...scenicSpots, ...foodSpots];
  const [hoverPoint, setHoverPoint] = useState(null);

  return (
    <div className="mainpage">
      <div className="title-frame">
        <div className="wrapper">
          {/* 头图：用 asset() 生成正确 URL */}
          <img src={asset("bg.JPG")} className="img-normal" alt="bg" />
          <img src={asset("bg.JPG")} className="img-wavy" alt="bg" />
        </div>
        <p className="title">
          <span className="outerbanks">Outer Banks<br /></span>
          <span className="nc">North Carolina</span>
        </p>
      </div>

      <div className="chips">
        <button className="chip">All</button>
        <button className="chip">Sights</button>
        <button className="chip">Food</button>
      </div>

      <div className="content">
        <div className="left">
          <span className="picture-title">Sights</span>
          <div className="picture-frame">
            {scenicPhotos.map((p) => (
              <figure
                key={p.name}
                className="polaroid"
                onMouseEnter={() => setHoverPoint(p)}
                onMouseLeave={() => setHoverPoint(null)}
              >
                {/* 这里用 asset(p.file) */}
                <img src={asset(p.file)} alt={p.name} />
                <figcaption className="caption">
                  <div className="polaroid-title">{p.name}</div>
                  <br />
                  <div className="date">{p.date ?? "—"}</div>
                </figcaption>
              </figure>
            ))}
          </div>

          <span className="picture-title">Food</span>
          <div className="picture-frame">
            {foodPhotos.map((p) => (
              <figure
                key={p.name}
                className="polaroid"
                onMouseEnter={() => setHoverPoint(p)}
                onMouseLeave={() => setHoverPoint(null)}
              >
                <img src={asset(p.file)} alt={p.name} />
                <figcaption className="caption">
                  <div className="polaroid-title">{p.name}</div>
                  <br />
                  <div className="date">{p.date ?? "—"}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        <div className="right">
          <span className="map-title">Map of Outer Banks<br /></span>
          <div className="map">
            <Map markers={visitedSpots} hoverPoint={hoverPoint?.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
