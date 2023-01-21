import AppLayout from "../components/AppLayout";

export default function Billing() {
  return <div style={{ padding: "1rem" }}>Billing page</div>;
}

Billing.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>;
};
