import React, { useEffect, useState, useRef } from "react";
import {
  getLatLngFromEvent,
  createEventPopupHTML,
} from "../helpers/ticketmaster";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_GL_TOKEN;

interface MapboxProps {
  gigs: any[];
}

export const Mapbox = ({ gigs }: MapboxProps) => {
  const mapContainer = useRef(null);
  const map: any = useRef(null);
  let hoveredPolygonId: React.MutableRefObject<null> | null = useRef(null);
  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/rlyhan/cll2i2nxz00e101qp8wn95xl1",
      center: [-0.063, 51.486],
      zoom: 9,
      trackResize: true,
    });

    map.on("load", () => {
      // Add the main data (boroughs of London)
      map.addSource("boroughs", {
        type: "geojson",
        data: "https://skgrange.github.io/www/data/london_boroughs.json",
        generateId: true,
      });

      map.addLayer({
        id: "borough-fills",
        type: "fill",
        source: "boroughs",
        layout: {},
        paint: {
          "fill-color": "#627BC1",
          "fill-opacity": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            1,
            0.5,
          ],
        },
      });

      map.on("mousemove", "borough-fills", (e) => {
        if (e.features.length > 0) {
          if (hoveredPolygonId !== null) {
            map.setFeatureState(
              { source: "boroughs", id: hoveredPolygonId },
              { hover: false }
            );
          }
          hoveredPolygonId = e.features[0].id;
          map.setFeatureState(
            { source: "boroughs", id: hoveredPolygonId },
            { hover: true }
          );
        }
      });

      map.on("mouseleave", "borough-fills", () => {
        if (hoveredPolygonId !== null) {
          map.setFeatureState(
            { source: "boroughs", id: hoveredPolygonId },
            { hover: false }
          );
        }
        hoveredPolygonId = null;
      });

      if (gigs) {
        gigs.forEach((gig) => {
          const location = getLatLngFromEvent(gig);
          if (location) {
            const marker = new mapboxgl.Marker().setLngLat(location).addTo(map);
            const popup = new mapboxgl.Popup({
              className: "eventPopup",
            }).setHTML(createEventPopupHTML(gig));
            marker.setPopup(popup);
          }
        });
      }
    });
    window.addEventListener("resize", forceMapResize);

    return () => {
      map.remove();
    };
  }, []);

  useEffect(() => {}, [gigs]);

  const forceMapResize = () => {
    if (map.current) {
      map.resize();
    }
  };

  return (
    <div
      className="mapContainer"
      ref={mapContainer}
      style={{
        border: "1px solid #212121",
        boxSizing: "border-box",
      }}
    ></div>
  );
};

export default Mapbox;
