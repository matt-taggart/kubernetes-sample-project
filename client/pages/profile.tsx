import { Typography } from "antd";
import AppLayout from "../components/AppLayout";

export default function Profile() {
  return (
    <AppLayout>
      <div style={{ padding: "1rem" }}>
        <Typography>
          <Typography.Title>My Profile</Typography.Title>
        </Typography>
      </div>
    </AppLayout>
  );
}
