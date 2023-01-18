import { Typography } from "antd";
import AppLayout from "../components/AppLayout";

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
