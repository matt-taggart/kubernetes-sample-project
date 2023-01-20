import { Typography } from "antd";
import AppLayout from "../components/AppLayout";

export default function Cards() {
  return (
    <div style={{ padding: "1rem" }}>
      <Typography>
        <Typography.Title level={3}>My Cards</Typography.Title>
      </Typography>
    </div>
  );
}

Cards.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>;
};
