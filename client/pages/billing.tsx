import { Typography } from "antd";
import AppLayout from "../components/AppLayout";

export default function Billing() {
  return (
    <div style={{ padding: "1rem" }}>
      <Typography>
        <Typography.Title level={3}>Billing Info</Typography.Title>
      </Typography>
    </div>
  );
}

Billing.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>;
};
