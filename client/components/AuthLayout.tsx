import { Typography } from "antd";
import { GreetingCardSVG } from "../components/GreetingCardSVG";

export default function AppLayout({ children }) {
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
        <div className="hstack" style={{ "--space": "0.5rem" }}>
          <Typography>
            <Typography.Paragraph
              style={{ fontSize: "1.2rem", marginBottom: "0" }}
            >
              Card Couture
            </Typography.Paragraph>
          </Typography>
          <GreetingCardSVG />
        </div>
      </div>
      <main>{children}</main>
    </>
  );
}
