import moment from "moment";

import { filterImagesByAspectRatio } from "./filters";

const getEventsUrl = (date: Date) => {
  const dayAfter = new Date(date);
  dayAfter.setDate(date.getDate() + 1);
  return `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${
    process.env.NEXT_PUBLIC_TICKETMASTER_KEY
  }&city=London&countryCode=GB&classificationName=Music&startDateTime=${
    date.toISOString().split("T")[0]
  }T00:00:00Z&endDateTime=${
    dayAfter.toISOString().split("T")[0]
  }T00:00:00Z&size=100&sort=date,asc`;
};

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
  src=${filterImagesByAspectRatio(event.images, "3_2")[0].url}
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

export { getEventsUrl, getLatLngFromEvent, createEventPopupHTML };
