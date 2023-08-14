import moment from "moment";

import { filterImagesByAspectRatio } from "./filters";

const getLatLngFromEvent = (event: any) => {
  if (event._embedded?.venues) {
    const location = event._embedded?.venues[0]?.location;
    if (location && !isNaN(location.latitude) && !isNaN(location.longitude)) {
      return [location.longitude, location.latitude];
    }
  }
  return null;
};

const createEventPopupHTML = (event: any) => {
  const image = `<img
  src=${filterImagesByAspectRatio(event.images, "3_2").url}
/>`;
  const heading = `<h3 style="font-size: 16px; margin: 0 0 .5em;">${event.name}</h3>`;
  const paragraph = (text: string) =>
    `<p style="font-size: 14px; margin: 0;">${text}</p>`;
  const textContent =
    heading +
    paragraph(event._embedded?.venues[0]?.name) +
    paragraph(
      `${moment(event.dates.start.localDate).format("MMMM Do YYYY")}, ${moment(
        event.dates.start.localTime,
        "HH:mm:ss"
      ).format("h:mm A")}`
    );

  return `${image}
<div className="mapboxgl-popup-content-text" style="padding: 10px;">
${textContent}
</div>`;
};

export { getLatLngFromEvent, createEventPopupHTML };
