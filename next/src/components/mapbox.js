import React, { Component } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_GL_TOKEN;

class Mapbox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lng: -0.063,
      lat: 51.486,
      zoom: 9,
      mapLoaded: false,
      displayDataName: "total",
    };
  }

  componentDidMount() {
    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: "mapbox://styles/rlyhan/cll2i2nxz00e101qp8wn95xl1",
      center: [this.state.lng, this.state.lat],
      zoom: this.state.zoom,
      trackResize: true,
    });
    let hoveredPolygonId = null;

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
          console.log(e.features[0]);
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
    });
    this.map = map;
    window.addEventListener("resize", this.forceMapResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.forceMapResize);
    this.map.remove();
  }

  forceMapResize = () => {
    if (this.map) {
      this.map.resize();
    }
  };

  render() {
    return (
      <div
        className="mapContainer"
        ref={(el) => (this.mapContainer = el)}
        style={{
          border: "1px solid #212121",
          boxSizing: "border-box",
        }}
      ></div>
    );
  }
}

export default Mapbox;
