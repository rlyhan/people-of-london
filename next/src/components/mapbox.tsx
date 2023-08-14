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

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_GL_TOKEN || "";

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
  let hoveredPolygonId: React.MutableRefObject<null> | null = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [currentMarker, setCurrentMarker] = useState(null);

  useEffect(() => {
    const mapboxMap = new mapboxgl.Map({
      // @ts-ignore
      container: mapContainer.current,
      style: "mapbox://styles/rlyhan/cll2i2nxz00e101qp8wn95xl1",
      center: [-0.063, 51.486],
      zoom: 9,
      trackResize: true,
    });

    if (window.innerWidth < 1024 && document.getElementById("sidebar")) {
      // @ts-ignore
      mapContainer.current.style.height = `calc(100vh - ${
        // @ts-ignore
        document.getElementById("sidebar").offsetHeight
      }px)`;
    }

    mapboxMap.on("load", () => {
      // Add the main data (boroughs of London)
      mapboxMap.addSource("boroughs", {
        type: "geojson",
        data: "https://skgrange.github.io/www/data/london_boroughs.json",
        generateId: true,
      });

      mapboxMap.addLayer({
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

      mapboxMap.on("mousemove", "borough-fills", (e) => {
        // @ts-ignore
        if (e.features.length > 0) {
          if (hoveredPolygonId !== null) {
            mapboxMap.setFeatureState(
              // @ts-ignore
              { source: "boroughs", id: hoveredPolygonId },
              { hover: false }
            );
          }
          // @ts-ignore
          hoveredPolygonId = e.features[0].id;
          mapboxMap.setFeatureState(
            // @ts-ignore
            { source: "boroughs", id: hoveredPolygonId },
            { hover: true }
          );
        }
      });

      mapboxMap.on("mouseleave", "borough-fills", () => {
        if (hoveredPolygonId !== null) {
          mapboxMap.setFeatureState(
            // @ts-ignore
            { source: "boroughs", id: hoveredPolygonId },
            { hover: false }
          );
        }
        hoveredPolygonId = null;
      });

      setupMarkers(gigs);
    });

    // @ts-ignore
    setMap(mapboxMap);

    window.addEventListener("resize", () => {
      if (mapContainer.current) {
        if (window.innerWidth < 1024 && document.getElementById("sidebar")) {
          // @ts-ignore
          mapContainer.current.style.height = `calc(100vh - ${
            // @ts-ignore
            document.getElementById("sidebar").offsetHeight
          }px)`;
        } else {
          // @ts-ignore
          mapContainer.current.style.height = "100vh";
        }
      }
    });

    return () => {
      mapboxMap.remove();
    };
  }, []);

  // When gigs are updated, create new markers
  useEffect(() => {
    if (gigs) setupMarkers(gigs);
  }, [gigs]);

  // When markers are updated, add them to map
  useEffect(() => {
    if (map) {
      markers.forEach((marker) => {
        // @ts-ignore
        marker.addTo(map);
      });
    }
  }, [markers, map]);

  // Clear current markers
  // Create new markers corresponding to gig location
  const setupMarkers = (gigs: any[]) => {
    clearMarkers();
    if (map) {
      // TODO: Identify differences between previous markers/gigs array and current? To avoid removing and adding already existing markers
      const markerList: any[] = [];
      gigs.forEach((gig) => {
        markerList.push(createMarker(gig));
      });
      setMarkers(markerList);
    }
  };

  const clearMarkers = () => {
    markers.forEach((marker) => marker.remove());
  };

  const createMarker = (gig: any) => {
    const location = getLatLngFromEvent(gig);
    if (location) {
      // @ts-ignore
      const marker = new mapboxgl.Marker().setLngLat(location);
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

  // When the selectedGigId changes (by hovering over sidebar gigs
  // or hovering over markers)...
  // Remove current marker if it is not null
  // If selectedGigId is not null,
  // find marker on map by id that matches selectedGigId
  // and set currentMarker to that marker + show its popup
  useEffect(() => {
    if (currentMarker) {
      // @ts-ignore
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
