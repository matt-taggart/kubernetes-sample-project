import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import AppLayout from "../components/AppLayout";
import { checkAuthRoute } from "../middleware/checkAuthRoute";

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
  return <div style={{ padding: "1rem" }}>Greetings page</div>;
}

export async function getServerSideProps(context) {
  return checkAuthRoute(context);
}

Greetings.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>;
};
