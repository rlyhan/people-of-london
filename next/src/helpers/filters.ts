import moment from "moment";

import { getLatLngFromEvent } from "./ticketmaster";

const filterEventsByAttractionId = (events) => {
  const distinctEvents = [];
  const distinctAttractionIds = new Set();
  events.forEach((event, index) => {
    if (
      index === 0 ||
      (event._embedded?.attractions &&
        !Array.from(distinctAttractionIds).includes(
          event._embedded?.attractions[0]?.id
        ))
    ) {
      distinctEvents.push(event);
      distinctAttractionIds.add(event._embedded.attractions[0]?.id);
    }
  });
  console.log(distinctEvents);
  return distinctEvents;
};

const filterEventsByDate = (events, date: Date) => {
  return events.filter(
    (event) =>
      moment(event.dates.start.dateTime).format("YYYY-MM-DD") ===
      moment(date).format("YYYY-MM-DD")
  );
};

const filterEventsByExistingVenue = (events) => {
  return events.filter((event) => getLatLngFromEvent(event) !== null);
};

const filterImagesByAspectRatio = (images, aspectRatio) => {
  return images.filter((image) => image.ratio === aspectRatio)[0] || images[0];
};

export {
  filterEventsByAttractionId,
  filterEventsByDate,
  filterEventsByExistingVenue,
  filterImagesByAspectRatio,
};
