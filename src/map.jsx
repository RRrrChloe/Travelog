// // src/Map.jsx
// import { useEffect, useRef } from "react";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";

// export default function Map({ markers = [], hoverPoint = null }) {
//   const mapRef = useRef(null);
//   const layerRef = useRef(null);

//   // 1) 只初始化一次地图
//   useEffect(() => {
//     if (mapRef.current) return;

//     mapRef.current = L.map("map", { zoomControl: true });
//     L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//       attribution: "© OpenStreetMap",
//     }).addTo(mapRef.current);

//     layerRef.current = L.layerGroup().addTo(mapRef.current);

//     // 给个初始视图（会被下面 fitBounds 覆盖）
//     mapRef.current.setView([35, -78], 7);
//   }, []);

//   // 2) 根据 markers 渲染点，并自动缩放到包含所有点
//   useEffect(() => {
//     if (!mapRef.current || !layerRef.current) return;

//     layerRef.current.clearLayers();
//     if (!markers || markers.length === 0) return;

//     const latlngs = [];

//     markers.forEach((m) => {
//       const latlng = L.latLng(m.lat, m.lng);
//       latlngs.push(latlng);
//       L.marker(latlng).addTo(layerRef.current).bindPopup(m.name || "");
//     });

//     if (latlngs.length === 1) {
//       // 只有一个点时，给一个合适的放大级别
//       mapRef.current.setView(latlngs[0], 12, { animate: true });
//     } else {
//       // 多个点：自动缩放并留出边距
//       const bounds = L.latLngBounds(latlngs);
//       mapRef.current.fitBounds(bounds, { padding: [40, 40], animate: true });
//     }
//   }, [markers]);

//   // 3) 悬浮某张图片时，只平移/微调缩放到该点（不画红圈）
//   useEffect(() => {
//     if (!mapRef.current || !hoverPoint) return;
//     const target = [hoverPoint.lat, hoverPoint.lng];
//     const z = Math.max(mapRef.current.getZoom() ?? 7, 11); // 至少 11 级
//     mapRef.current.setView(target, z, { animate: true });
//   }, [hoverPoint]);

//   return (
//     <div
//       id="map"
//       style={{ width: "100%", height: "520px", borderRadius: 8, overflow: "hidden" }}
//     />
//   );
// }


import { MapContainer, TileLayer, Marker, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect, useMemo } from "react";

// 蓝色默认（景点）
const sightIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  tooltipAnchor: [16, -28],
});

// 红色（饭店）
const foodIcon = new L.DivIcon({
  className: "food-marker",
  html: '<div style="width:18px;height:18px;border-radius:50%;background:#e53e3e;border:3px solid white;box-shadow:0 0 6px rgba(0,0,0,.35)"></div>',
  iconSize: [18, 18],
  iconAnchor: [9, 18],
  tooltipAnchor: [0, -12],
});

// 高亮用（当 hoverPoint 命中时）
const activeIcon = new L.DivIcon({
  className: "active-marker",
  html: '<div style="width:20px;height:20px;border-radius:50%;background:#2b6cb0;border:4px solid white;box-shadow:0 0 10px rgba(0,0,0,.4)"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 20],
  tooltipAnchor: [0, -14],
});

export default function Map({ markers, hoverPoint }) {
  const points = markers.map(m => [m.lat, m.lng]);
  const center = points[0] ?? [35.9, -75.6];

  return (
    <MapContainer center={center} zoom={8} style={{ height: 420, width: "100%", borderRadius: 14 }}>
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitAllBounds points={points} />

      {markers.map((m) => {
        const isActive = hoverPoint === m.id;
        const baseIcon = m.type === "food" ? foodIcon : sightIcon;
        const icon = isActive ? activeIcon : baseIcon;

        return (
          <Marker
            key={m.id}
            position={[m.lat, m.lng]}
            icon={icon}
            eventHandlers={{
              mouseover: (e) => e.target.openTooltip(),
              mouseout: (e) => !isActive && e.target.closeTooltip(),
            }}
          >
            <Tooltip direction="top" sticky={true} permanent={isActive} opacity={1}>
              {m.name}
            </Tooltip>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

function FitAllBounds({ points }) {
  const map = useMap();
  const bounds = useMemo(() => L.latLngBounds(points), [points]);
  useEffect(() => {
    if (points.length) map.fitBounds(bounds, { padding: [32, 32] });
  }, [map, bounds, points.length]);
  return null;
}
