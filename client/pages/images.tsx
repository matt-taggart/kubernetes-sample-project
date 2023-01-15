import AppLayout from "../components/AppLayout";
import { Typography } from "antd";

export default function Images() {
  return (
    <div style={{ padding: "1rem" }}>
      <Typography>
        <Typography.Title>Saved Images</Typography.Title>
      </Typography>
    </div>
  );
}

Images.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>;
};
