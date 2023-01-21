import Head from "next/head";
import NuxtLink from "next/link";

export default function AppLayout({ children }) {
  const items = [
    {
      label: <NuxtLink href="/">Create Card</NuxtLink>,
      key: "1",
    },
    {
      label: <NuxtLink href="/add-greeting">Add Greeting</NuxtLink>,
      key: "2",
    },
    {
      label: <NuxtLink href="/cards">My Cards</NuxtLink>,
      key: "3",
    },
    {
      label: <NuxtLink href="/images">Saved Images</NuxtLink>,
      key: "4",
    },
    {
      label: <NuxtLink href="/greetings">Saved Greetings</NuxtLink>,
      key: "5",
    },
  ];
  const dropdownItems = [
    {
      key: "1",
      label: <NuxtLink href="/profile">Profile</NuxtLink>,
    },
    {
      key: "2",
      label: <NuxtLink href="/billing">Billing</NuxtLink>,
    },
    {
      key: "3",
      label: <NuxtLink href="/login">Logout</NuxtLink>,
    },
  ];
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        style={{
          display: "flex",
          padding: "0 2rem",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#fff",
          height: "50px",
          position: "sticky",
          top: 0,
          zIndex: 1,
          width: "100%",
          borderBottom: "1px solid rgba(5, 5, 5, 0.06)",
        }}
      >
        Header
      </div>
      <main>{children}</main>
    </>
  );
}
