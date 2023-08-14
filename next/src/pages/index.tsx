import Layout from "../components/layout";
import Mapbox from "../components/mapbox";
import Sidebar from "../components/sidebar";
import Modal from "../components/modal";
import {
  filterEventsByAttractionId,
  filterEventsByDate,
  filterEventsByExistingVenue,
} from "../helpers/filters";
import { getEventsUrl } from "../helpers/ticketmaster";
import React, { useState } from "react";

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
    const res = await fetch(getEventsUrl(today));
    const data = await res.json();
    // Removes events with no venue location
    const gigs = filterEventsByExistingVenue(data._embedded.events);

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
