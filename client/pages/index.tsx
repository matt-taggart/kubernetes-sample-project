import AppLayout from "../components/AppLayout";
import { checkAuthRoute } from "../middleware/checkAuthRoute";

function Home() {
  return <div>Create New Card</div>;
}

Home.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>;
};

export async function getServerSideProps(context) {
  return checkAuthRoute(context);
}

export default Home;
