import AppLayout from "../components/AppLayout";

export default function Cards() {
  return <div style={{ padding: "1rem" }}>Cards Page</div>;
}

Cards.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>;
};
