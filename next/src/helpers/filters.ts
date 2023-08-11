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

const filterImagesByAspectRatio = (images, aspectRatio) => {
  return images.filter((image) => image.ratio === aspectRatio)[0] || images[0];
};

export { filterEventsByAttractionId, filterImagesByAspectRatio };
