import { useRouter } from "next/router";
import { Button, Form, Input, Typography } from "antd";
import Image from "next/image";
import NuxtLink from "next/link";
import axios from "axios";
import AuthLayout from "../components/AuthLayout";
import CardImage from "../public/moody-card.jpg";
import styles from "../styles/login.module.css";

export default function Register() {
  const router = useRouter();
  const onFinish = async (values: any) => {
    await axios({
      url: "/v1/register",
      method: "post",
      data: values,
      withCredentials: true,
    });
    router.push("/");
  };
  return (
    <div className={styles.container}>
      <Image
        className={styles.photo}
        src={CardImage}
        alt="Greeting card on table"
      />
      <div className={styles.form}>
        <Form
          name="basic"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
            <Typography>
              <Typography.Title style={{ marginBottom: 0 }}>
                Register
              </Typography.Title>
            </Typography>
          </Form.Item>
          <Form.Item
            label="First Name"
            name="firstName"
            rules={[
              { required: true, message: "Please enter your first name" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[{ required: true, message: "Please enter your last name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please enter your email" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
            <Typography.Text type="secondary">
              Already have an account? <NuxtLink href="/login">Login</NuxtLink>
            </Typography.Text>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

Register.getLayout = function getLayout(page) {
  return <AuthLayout>{page}</AuthLayout>;
};
