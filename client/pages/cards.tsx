import AppLayout from "../components/AppLayout";
import { checkAuthRoute } from "../middleware/checkAuthRoute";

export default function Cards() {
  return <div style={{ padding: "1rem" }}>Cards Page</div>;
}

export async function getServerSideProps(context) {
  return checkAuthRoute(context);
}

Cards.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>;
};
