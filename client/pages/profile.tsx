import AppLayout from "../components/AppLayout";
import { checkAuthRoute } from "../middleware/checkAuthRoute";

export default function Profile() {
  return <div style={{ padding: "1rem" }}>My Profile</div>;
}

export async function getServerSideProps(context) {
  return checkAuthRoute(context);
}

Profile.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>;
};
