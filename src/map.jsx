import { MapContainer, TileLayer, Marker, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect, useMemo } from "react";

// 蓝色景点
const sightIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  tooltipAnchor: [16, -28],
});

// 红色饭
const foodIcon = new L.DivIcon({
  className: "food-marker",
  html: '<div style="width:18px;height:18px;border-radius:50%;background:#e53e3e;border:3px solid white;box-shadow:0 0 6px rgba(0,0,0,.35)"></div>',
  iconSize: [18, 18],
  iconAnchor: [9, 18],
  tooltipAnchor: [0, -12],
});

// 高亮
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
