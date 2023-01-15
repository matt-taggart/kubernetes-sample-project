import AppLayout from "../components/AppLayout";
import { Typography } from "antd";

export default function Billing() {
  return (
    <div style={{ padding: "1rem" }}>
      <Typography>
        <Typography.Title>Billing Info</Typography.Title>
      </Typography>
    </div>
  );
}

Billing.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>;
};
