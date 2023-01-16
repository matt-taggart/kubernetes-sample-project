import { Typography } from "antd";
import axios from "axios";
import AppLayout from "../components/AppLayout";

function Home({ accessToken, customer }) {
  return (
    <div style={{ padding: "1rem" }}>
      <Typography>
        <Typography.Title>My Cards</Typography.Title>
      </Typography>
    </div>
  );
}

Home.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>;
};

export async function getServerSideProps() {
  try {
    const { data: tokenData } = await axios.post("/api/refresh-token", {
      withCredentials: true,
    });
    const { data: customerData } = await axios.get("/api/customers", {
      headers: {
        Authorization: `Bearer ${tokenData.accessToken}`,
      },
    });
    return {
      accessToken: tokenData.accessToken,
      customer: customerData.customer,
    };
  } catch (error) {
    console.log("%cerror", "color:cyan; ", error);
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }
}

export default Home;
