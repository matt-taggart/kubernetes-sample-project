import { Typography, Input, Button, Form, notification } from "antd";
import axios from "axios";
import AppLayout from "../components/AppLayout";

const { Title, Text } = Typography;

type Props = {
  accessToken: string;
};

function AddGreeting({ accessToken }: Props) {
  const [api, contextHolder] = notification.useNotification();

  const onFinish = async (values: any) => {
    await axios({
      url: "/v1/greeting",
      method: "post",
      data: values,
      withCredentials: true,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });

    api["success"]({
      message: "Greeting saved!",
    });
  };
  return (
    <div className="stack" style={{ padding: "1rem" }}>
      {contextHolder}
      <Title level={3}>Add Greeting</Title>
      <div style={{ width: "min(100%, 400px)" }}>
        <Text>
          Write a brief description of the greeting that you would like to
          generate.
        </Text>
        <Form
          name="basic"
          wrapperCol={{ span: 24 }}
          initialValues={{ description: "" }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="prompt"
            rules={[{ required: true, message: "Please enter a description" }]}
          >
            <Input.TextArea showCount maxLength={100} rows={4} />
          </Form.Item>

          <Form.Item wrapperCol={{ span: 24 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

AddGreeting.getLayout = function getLayout(page) {
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
        redirect: {
          permanent: false,
          destination: "/login",
        },
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

export default AddGreeting;
