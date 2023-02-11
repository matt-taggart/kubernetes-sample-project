export default function AuthLayout({ children }) {
  return (
    <>
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
        Griffin
      </div>
      <main>{children}</main>
    </>
  );
}

export async function getServerSideProps(context) {
  const authCookie = context.req.cookies
    ? { Cookie: `cc_auth=${context.req.cookies["cc_auth"]};` }
    : {};
  if (!authCookie) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }
}
