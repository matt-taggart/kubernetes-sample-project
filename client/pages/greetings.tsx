import AppLayout from "../components/AppLayout";
import { Typography } from "antd";

export default function Greetings() {
  return (
    <div style={{ padding: "1rem" }}>
      <Typography>
        <Typography.Title>Saved Greetings</Typography.Title>
      </Typography>
    </div>
  );
}

Greetings.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>;
};
