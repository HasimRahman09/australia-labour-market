import { useEffect, useState, useRef, useCallback } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { feature } from "topojson-client";
import "leaflet/dist/leaflet.css";

function getColor(rate) {
  if (rate == null) return "#d1d5db";
  if (rate < 2) return "#dcfce7";
  if (rate < 3) return "#86efac";
  if (rate < 4) return "#fef08a";
  if (rate < 5) return "#fde047";
  if (rate < 6) return "#fdba74";
  if (rate < 8) return "#fb923c";
  if (rate < 10) return "#f87171";
  if (rate < 15) return "#dc2626";
  return "#7f1d1d";
}

const LEGEND_ITEMS = [
  { label: "< 2%", color: "#dcfce7" },
  { label: "2–3%", color: "#86efac" },
  { label: "3–4%", color: "#fef08a" },
  { label: "4–5%", color: "#fde047" },
  { label: "5–6%", color: "#fdba74" },
  { label: "6–8%", color: "#fb923c" },
  { label: "8–10%", color: "#f87171" },
  { label: "10–15%", color: "#dc2626" },
  { label: "15%+", color: "#7f1d1d" },
];

export default function SuburbMap({ salmData }) {
  const [geoData, setGeoData] = useState(null);
  const [hovered, setHovered] = useState(null);
  const geoJsonRef = useRef(null);

  // Build lookup: SA2 code -> unemployment data
  const dataLookup = {};
  for (const s of salmData.suburbs) {
    dataLookup[s.code] = s;
  }

  useEffect(() => {
    fetch("/sa2_nsw.topojson")
      .then((r) => r.json())
      .then((topo) => {
        const objectName = Object.keys(topo.objects)[0];
        const geo = feature(topo, topo.objects[objectName]);
        setGeoData(geo);
      });
  }, []);

  const style = useCallback(
    (feat) => {
      const code = feat.properties.SA2_CODE21;
      const d = dataLookup[code];
      const rate = d?.unemployment_rate;
      return {
        fillColor: getColor(rate),
        weight: 0.5,
        color: "#9ca3af",
        fillOpacity: 0.85,
      };
    },
    [dataLookup]
  );

  const onEachFeature = useCallback(
    (feat, layer) => {
      const code = feat.properties.SA2_CODE21;
      const name = feat.properties.SA2_NAME21;
      const d = dataLookup[code];

      layer.on({
        mouseover: (e) => {
          e.target.setStyle({ weight: 2, color: "#111827", fillOpacity: 0.95 });
          e.target.bringToFront();
          setHovered({
            name,
            rate: d?.unemployment_rate,
            persons: d?.unemployed_persons,
            lf: d?.labour_force,
            region: feat.properties.SA4_NAME21,
          });
        },
        mouseout: (e) => {
          if (geoJsonRef.current) {
            geoJsonRef.current.resetStyle(e.target);
          }
          setHovered(null);
        },
      });
    },
    [dataLookup]
  );

  if (!geoData) {
    return (
      <div className="chart-container" style={{ height: 500, display: "flex", alignItems: "center", justifyContent: "center" }}>
        Loading map...
      </div>
    );
  }

  return (
    <div style={{ position: "relative" }}>
      <div className="chart-container" style={{ padding: 0, overflow: "hidden" }}>
        <MapContainer
          center={[-32.5, 148.5]}
          zoom={6}
          style={{ height: 550, width: "100%" }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
          />
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png"
            pane="shadowPane"
          />
          <GeoJSON
            ref={geoJsonRef}
            data={geoData}
            style={style}
            onEachFeature={onEachFeature}
          />
        </MapContainer>
      </div>

      {/* Hover tooltip */}
      {hovered && (
        <div className="map-tooltip">
          <div className="map-tooltip-name">{hovered.name}</div>
          <div className="map-tooltip-region">{hovered.region}</div>
          <div className="map-tooltip-rate" style={{ color: getColor(hovered.rate) !== "#dcfce7" ? getColor(hovered.rate) : "#111" }}>
            {hovered.rate != null ? `${hovered.rate}%` : "No data"}
          </div>
          {hovered.persons != null && (
            <div className="map-tooltip-detail">
              {Math.round(hovered.persons).toLocaleString()} unemployed of{" "}
              {Math.round(hovered.lf).toLocaleString()} labour force
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="map-legend">
        <div className="map-legend-title">Unemployment rate</div>
        {LEGEND_ITEMS.map((item) => (
          <div key={item.label} className="map-legend-item">
            <span className="map-legend-swatch" style={{ background: item.color }} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
