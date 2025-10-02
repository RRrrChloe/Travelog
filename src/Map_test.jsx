// VisitsMap.jsx
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useMemo } from "react";

/** @typedef {{ id:string, name:string, position:[number, number] }} Spot */

const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  tooltipAnchor: [16, -28],
});

const activeIcon = new L.DivIcon({
  className: "active-marker",
  html: '<div style="width:18px;height:18px;border-radius:50%;background:#2b6cb0;border:3px solid white;box-shadow:0 0 6px rgba(0,0,0,.35)"></div>',
  iconSize: [18, 18],
  iconAnchor: [9, 18],
  tooltipAnchor: [0, -12],
});

/** @param {{spots: Array<Spot>, hoverId?: (string|null)}} props */
export default function VisitsMap({ spots, hoverId }) {
  const center = spots.length ? spots[0].position : [35.9, -75.6];

  return (
    <MapContainer center={center} zoom={8} style={{ height: 420, width: "100%", borderRadius: 14 }}>
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitAllBounds points={spots.map(s => s.position)} />

      {spots.map((s) => {
        const active = hoverId === s.id;
        return (
          <Marker
            key={s.id}
            position={s.position}
            icon={active ? activeIcon : defaultIcon}
            eventHandlers={{
              mouseover: (e) => (e.target).openTooltip(),
              mouseout: (e) => (e.target).closeTooltip(),
            }}
          >
            <Tooltip direction="top" sticky={true} permanent={active} opacity={1}>
              {s.name}
            </Tooltip>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
