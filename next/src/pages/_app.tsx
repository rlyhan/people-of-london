import "@/styles/globals.scss";
import "@/styles/mapbox.scss";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

// export async function getStaticProps() {
//   const res = await fetch(process.env.API_URL);
//   const objects = await res.json();

//   return {
//     props: {
//       objects,
//     },
//   };
// }
