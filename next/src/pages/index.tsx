import Layout from "../components/layout";
import Mapbox from "../components/mapbox";
import Sidebar from "../components/sidebar";
import { TestModel } from "@/types";

interface HomePageProps {
  objects: TestModel[];
}

function Home({ objects }: HomePageProps) {
  return (
    <Layout home>
      <Sidebar />
      <Mapbox />
    </Layout>
  );
}

export default Home;
