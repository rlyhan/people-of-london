import moment from "moment";

import { getLatLngFromEvent } from "./ticketmaster";

const filterEventsByAttractionId = (events: any[]) => {
  const distinctEvents: any[] = [];
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
  return distinctEvents;
};

const filterEventsByDate = (events: any[], date: Date) => {
  return events.filter(
    (event) =>
      moment(event.dates.start.dateTime).format("YYYY-MM-DD") ===
      moment(date).format("YYYY-MM-DD")
  );
};

const filterEventsByExistingVenue = (events: any[]) => {
  return events.filter((event) => getLatLngFromEvent(event) !== null);
};

const filterImagesByAspectRatio = (images: any[], aspectRatio: string) => {
  return images.filter((image) => image.ratio === aspectRatio)[0] || images[0];
};

export {
  filterEventsByAttractionId,
  filterEventsByDate,
  filterEventsByExistingVenue,
  filterImagesByAspectRatio,
};
