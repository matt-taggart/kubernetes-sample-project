import { Typography } from "antd";
import axios from "axios";
import AppLayout from "../components/AppLayout";

function Home() {
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

export async function getServerSideProps(context) {
  try {
    const authCookie = context.req.cookies
      ? { Cookie: `cc_auth=${context.req.cookies["cc_auth"]};` }
      : {};
    try {
      const { data: tokenData } = await axios({
        url: "http://server-cluster-ip-service:8080/refresh-token",
        method: "post",
        headers: Object.assign({}, authCookie),
        withCredentials: true,
      });

      const { data: customerData } = await axios({
        url: "http://server-cluster-ip-service:8080/customers",
        method: "get",
        headers: {
          Authorization: `Bearer ${tokenData.accessToken}`,
        },
        withCredentials: true,
      });

      if (!customerData.customer) {
        return {
          redirect: {
            permanent: false,
            destination: "/login",
          },
        };
      }

      return {
        props: {
          accessToken: tokenData.accessToken,
          customer: customerData.customer,
        },
      };
    } catch (error) {
      return {
        props: { error: error.message },
      };
    }
  } catch (error) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }
}

export default Home;
