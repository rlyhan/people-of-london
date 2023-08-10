import Layout from "../components/layout";
import Mapbox from "../components/mapbox";
import Sidebar from "../components/sidebar";
import { TestModel } from "@/types";

interface HomePageProps {
  objects: TestModel[];
  gigs: any;
}

function Home({ objects, gigs }: HomePageProps) {
  return (
    <Layout home>
      <Sidebar gigs={gigs} />
      <Mapbox />
    </Layout>
  );
}

export async function getServerSideProps() {
  try {
    const res = await fetch(
      `https://app.ticketmaster.com/discovery/v2/attractions.json?apikey=${process.env.NEXT_PUBLIC_TICKETMASTER_KEY}&city=London&countryCode=GB&size=50&segmentId=KZFzniwnSyZfZ7v7nJ`
    );
    const data = await res.json();
    const gigs = data._embedded.attractions;

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
