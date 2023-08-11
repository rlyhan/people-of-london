import Layout from "../components/layout";
import Mapbox from "../components/mapbox";
import Sidebar from "../components/sidebar";

import React, { useEffect, useState } from "react";

interface HomePageProps {
  gigs: any;
}

function Home({ gigs }: HomePageProps) {
  const [markerLocations, setMarkerLocations] = useState<[[number, number]]>();

  return (
    <Layout home>
      <Sidebar gigs={gigs} />
      <Mapbox gigs={gigs} />
    </Layout>
  );
}

export async function getServerSideProps() {
  try {
    const today = new Date().toISOString();
    const res = await fetch(
      // `https://app.ticketmaster.com/discovery/v2/attractions.json?apikey=${process.env.NEXT_PUBLIC_TICKETMASTER_KEY}&city=London&countryCode=GB&size=50&segmentId=KZFzniwnSyZfZ7v7nJ`
      `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${process.env.NEXT_PUBLIC_TICKETMASTER_KEY}&city=London&countryCode=GB&segmentId=KZFzniwnSyZfZ7v7nJ&eventdate_from=${today}&size=50&sort_by=eventdate&order=asc`
    );
    const data = await res.json();
    const gigs = data._embedded.events;
    console.log(gigs);

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
