import Layout from "../components/layout";
import Mapbox from "../components/mapbox";
import Sidebar from "../components/sidebar";
import Modal from "../components/modal";
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
  const [gigList, setGigList] = useState(gigs);
  const [selectedGigId, setSelectedGigId] = useState<string | null>(null);
  const [modalGigId, setModalGigId] = useState<string | null>(null);

  return (
    <Layout home>
      <Sidebar
        gigs={gigList}
        setGigList={setGigList}
        setSelectedGigId={setSelectedGigId}
        setModalGigId={setModalGigId}
      />
      <Mapbox
        gigs={gigList}
        selectedGigId={selectedGigId}
        setSelectedGigId={setSelectedGigId}
      />
      {modalGigId && (
        <Modal
          gig={gigList.find((gig: any) => gig.id === modalGigId)}
          setModalGigId={setModalGigId}
        />
      )}
    </Layout>
  );
}

export async function getServerSideProps() {
  try {
    const today = new Date();
    const res = await fetch(
      `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${
        process.env.NEXT_PUBLIC_TICKETMASTER_KEY
      }&city=London&countryCode=GB&segmentId=KZFzniwnSyZfZ7v7nJ&eventdate_from=${today.toISOString()}&size=100&sort=date,asc`
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
