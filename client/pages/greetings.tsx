import { useEffect, useState, useMemo } from "react";
import { Typography, List } from "antd";
import axios from "axios";
import AppLayout from "../components/AppLayout";

export default function Greetings({ accessToken }) {
  const [greetings, setGreetings] = useState([]);
  const fetchGreetings = useMemo(
    () =>
      async function fetchGreetings() {
        const { data } = await axios({
          url: "v1/greetings",
          method: "get",
          withCredentials: true,
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        });

        setGreetings(data.greetings);
      },
    [accessToken, setGreetings]
  );

  useEffect(() => {
    fetchGreetings();
  }, [fetchGreetings]);
  return (
    <div style={{ padding: "1rem" }}>
      <Typography>
        <Typography.Title level={3}>Saved Greetings</Typography.Title>
        <List
          itemLayout="horizontal"
          dataSource={greetings}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={item.prompt}
                description={item.generatedText}
              />
            </List.Item>
          )}
        />
      </Typography>
    </div>
  );
}

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

Greetings.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>;
};
