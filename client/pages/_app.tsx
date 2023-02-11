import "../styles/globals.css";
import "../styles/every-layout.css";
import "../styles/style.css";
import "../styles/prism.css";
import "../styles/customizer.css";
import "../styles/radix.css";
import "react-virtualized/styles.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || ((page) => page);

  return getLayout(<Component {...pageProps} />);
}
