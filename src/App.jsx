import React, { useState } from "react";
import "leaflet/dist/leaflet.css";
import "./index.css";
import Map from "./map.jsx";

// 景点坐标
const scenicPhotos = [
  { name: "Bodie Island Lighthouse", src: "/image/lh.JPG", date: "Sep-3-2025", lat: 35.82612105339161, lng: -75.5640299888405 }, 
  { name: "Jockey's Ridge State Park", src: "/image/park2.JPG", date: "Sep-3-2025", lat: 35.985186058174605, lng: -75.64505415873117 },
  { name: "Springer's Point Preserve", src: "/image/ha.JPG", date: "Sep-4-2025", lat: 35.1066657323233, lng: -75.98647426996197 },
  { name: "Elizabethan Gardens", src: "/image/garden.JPG", date: "Sep-5-2025", lat: 35.94375907353072, lng: -75.71327634015823 }, //35.94375907353072, -75.71327634015823
];

const foodPhotos = [
  { name: "Ocracoke Fudge & Ice Cream Shop", src: "/image/icecream.JPG", date: "Sep-4-2025", lat: 35.11424914560601, lng: -75.98337313415955 },//35.11424914560601, -75.98337313415955
  { name: "SmacNally’s Waterfront Bar & Grill", src: "/image/burger.JPG", date: "Sep-4-2025", lat: 35.115223031106076, lng: -75.9845259027621},
  { name: "Blue Water Grill & Raw Bar", src: "/image/seafood.JPG", date: "Sep-5-2025", lat: 35.901932241784685, lng: -75.6442879804703 },
];

// const airbnbPhotos = [
//   { name: "Airbnb1", src: "/image/airbnb1.JPG", lat: 35.92612105339161, lng: -75.5640299888405 },
// ];  

export default function App() {
  // 地图上始终显示的常驻点
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
  const imgProps = (p) => ({
    src: p.src,
    alt: p.name,
    className: "picture",
    onMouseEnter: () => setHoverPoint(p),
    onMouseLeave: () => setHoverPoint(null),
  });

  return (
    <div className="mainpage">
      {/* 顶部标题 */}
      <div className="title-frame">
        <div className="wrapper">
          <img src="/image/bg.JPG" className="img-normal" />
          <img src="/image/bg.JPG" className="img-wavy" />
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
        {/* 左侧 */}
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
                <img src={p.src} alt={p.name} />
                <figcaption className="caption">
                  <div className="polaroid-title">{p.name}</div>
                  {/* <div>地点：{p.place ?? p.name}</div> */}
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
                <img src={p.src} alt={p.name} />
                <figcaption className="caption">
                  <div className="polaroid-title">{p.name}</div>
                  {/* <div>地点：{p.place ?? p.name}</div> */}
                  <br />
                  <div className="date">{p.date ?? "—"}</div>
                </figcaption>
              </figure>
            ))}
          </div>

          {/* <span className="picture-title">Airbnb</span>
          <div className="picture-frame">
            <div className="frame-8">
              Airbnb图片
            </div>
          </div> */}
        </div>

        {/* 右侧地图 */}
        <div className="right">
          <span className="map-title">Map of Outer Banks<br /></span>
          <div className="map">
            <Map markers={visitedSpots} hoverPoint={hoverPoint?.id} />
          </div>
          {/* <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[51.505, -0.09]}>
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker>
          </MapContainer> */}
        </div>
      </div>
    </div>
  );
};
