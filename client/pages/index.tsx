import AppLayout from "../components/AppLayout";
import { Typography } from "antd";

export default function Home() {
  return (
    <div style={{ padding: "1rem" }}>
      <Typography>
        <Typography.Title>My Cards</Typography.Title>
      </Typography>
    </div>
  );
}

Home.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>;
};
