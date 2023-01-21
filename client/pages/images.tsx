import AppLayout from "../components/AppLayout";

export default function Images() {
  return <div style={{ padding: "1rem" }}>Images</div>;
}

Images.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>;
};
