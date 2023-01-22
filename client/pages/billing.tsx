import AppLayout from "../components/AppLayout";
import { checkAuthRoute } from "../middleware/checkAuthRoute";

export default function Billing() {
  return <div style={{ padding: "1rem" }}>Billing page</div>;
}

export async function getServerSideProps(context) {
  return checkAuthRoute(context);
}

Billing.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>;
};
