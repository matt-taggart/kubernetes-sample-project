import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700&amp;display=swap"
          rel="stylesheet"
        />
      </Head>

      <body className="font-sans text-base font-normal text-gray-600 dark:text-gray-400 dark:bg-gray-800">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
