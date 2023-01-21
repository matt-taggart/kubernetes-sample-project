import AppLayout from "../components/AppLayout";

export default function Profile() {
  return <div style={{ padding: "1rem" }}>My Profile</div>;
}

Profile.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>;
};
