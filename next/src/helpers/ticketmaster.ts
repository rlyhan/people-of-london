import { filterImagesByAspectRatio } from "./filters";

const getLatLngFromEvent = (event) => {
  if (event._embedded?.venues) {
    const location = event._embedded?.venues[0]?.location;
    if (location && !isNaN(location.latitude) && !isNaN(location.longitude)) {
      return [location.longitude, location.latitude];
    }
  }
  return null;
};

const createEventPopupHTML = (event) => {
  return `<img
  src=${filterImagesByAspectRatio(event.images, "3_2").url}
/>
<h3>${event.name}</h3><p>${event.dates.start.localDate}</p><p>${
    event.dates.start.localTime
  }</p>`;
};

export { getLatLngFromEvent, createEventPopupHTML };
