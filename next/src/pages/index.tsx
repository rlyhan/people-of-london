import Layout from "../components/layout";
import Mapbox from "../components/mapbox";
import Sidebar from "../components/sidebar";
import {
  filterEventsByAttractionId,
  filterEventsByDate,
  filterEventsByExistingVenue,
} from "../helpers/filters";
import React, { useEffect, useState } from "react";
import moment from "moment";

interface HomePageProps {
  gigs: any;
}

function Home({ gigs }: HomePageProps) {
  const [selectedGigId, setSelectedGigId] = useState<string | null>(null);
  const [markerLocations, setMarkerLocations] = useState<[[number, number]]>();

  return (
    <Layout home>
      <Sidebar gigs={gigs} setSelectedGigId={setSelectedGigId} />
      <Mapbox
        gigs={gigs}
        selectedGigId={selectedGigId}
        setSelectedGigId={setSelectedGigId}
      />
    </Layout>
  );
}

export async function getServerSideProps() {
  try {
    const today = new Date();
    const res = await fetch(
      `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${
        process.env.NEXT_PUBLIC_TICKETMASTER_KEY
      }&city=London&countryCode=GB&segmentId=KZFzniwnSyZfZ7v7nJ&eventdate_from=${today.toISOString()}&size=50&sort=date,asc`
    );
    const data = await res.json();
    // Removes events with no venue location
    // Gets events by attraction id (show one event per attraction)
    // Gets today's events only
    const gigs = filterEventsByDate(
      filterEventsByAttractionId(
        filterEventsByExistingVenue(data._embedded.events)
      ),
      today
    );
    // console.log(gigs);

    return {
      props: {
        gigs,
      },
    };
  } catch (error) {
    console.error("Error:", error);

    return {
      props: {
        gigs: [],
      },
    };
  }
}

export default Home;
