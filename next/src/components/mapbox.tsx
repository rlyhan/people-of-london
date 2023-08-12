import React, {
  useEffect,
  useState,
  useRef,
  Dispatch,
  SetStateAction,
} from "react";
import {
  getLatLngFromEvent,
  createEventPopupHTML,
} from "../helpers/ticketmaster";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_GL_TOKEN;

interface MapboxProps {
  gigs: any[];
  selectedGigId: string | null;
  setSelectedGigId: Dispatch<SetStateAction<string | null>>;
}

export const Mapbox = ({
  gigs,
  selectedGigId,
  setSelectedGigId,
}: MapboxProps) => {
  const mapContainer = useRef(null);
  const map: any = useRef(null);
  let hoveredPolygonId: React.MutableRefObject<null> | null = useRef(null);
  const [markers, setMarkers] = useState([]);
  const [currentMarker, setCurrentMarker] = useState(null);

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
          "fill-color": "#FFFFFF",
          "fill-opacity": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            0.5,
            0.25,
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

      setupMarkers(gigs, map);
    });
    window.addEventListener("resize", forceMapResize);

    return () => {
      map.remove();
    };
  }, []);

  useEffect(() => {
    if (map.current) setupMarkers(gigs, map);
  }, [gigs, map]);

  // When the selectedGigId changes (by hovering over sidebar gigs
  // or hovering over markers)...
  // Remove current marker if it is not null
  // If selectedGigId is not null,
  // find marker on map by id that matches selectedGigId
  // and set currentMarker to that marker + show its popup
  useEffect(() => {
    if (currentMarker) {
      currentMarker.togglePopup();
      setCurrentMarker(null);
    }
    if (selectedGigId) {
      const gigMarker = markers.find(
        (marker) => marker._element?.dataset?.id === selectedGigId
      );
      if (gigMarker && currentMarker !== gigMarker) {
        gigMarker.togglePopup();
        setCurrentMarker(gigMarker);
      }
    }
  }, [selectedGigId]);

  const setupMarkers = (gigs, map) => {
    // TODO: Identify differences between previous markers/gigs array and current? To avoid removing and adding already existing markers
    const markerList: any[] = [];
    gigs.forEach((gig) => {
      markerList.push(createMarker(gig, map));
    });
    setMarkers(markerList);
  };

  const createMarker = (gig, map) => {
    const location = getLatLngFromEvent(gig);
    if (location) {
      const marker = new mapboxgl.Marker().setLngLat(location).addTo(map);
      const popup = new mapboxgl.Popup({
        className: "event-popup",
      }).setHTML(createEventPopupHTML(gig));
      marker.setPopup(popup);
      marker.getElement().setAttribute("data-id", gig.id);
      marker.getElement().addEventListener("mouseenter", () => {
        if (gig.id !== selectedGigId) {
          setSelectedGigId(gig.id);
        }
      });
      marker.getElement().addEventListener("mouseleave", () => {
        setSelectedGigId(null);
      });
      return marker;
    }
    return null;
  };

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
