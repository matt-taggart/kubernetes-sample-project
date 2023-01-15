import { useRouter } from "next/router";
import Image from "next/image";
import NuxtLink from "next/link";
import axios from "axios";
import { Button, Checkbox, Form, Input, Typography } from "antd";
import AuthLayout from "../components/AuthLayout";
import CardImage from "../public/moody-card.jpg";
import styles from "../styles/login.module.css";

export default function Login() {
  const router = useRouter();
  const onFinish = async (values: any) => {
    await axios.post("/api/login", values);
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
            <Typography.Title style={{ marginBottom: 0 }}>
              Login
            </Typography.Title>
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

          <Form.Item
            name="remember"
            valuePropName="checked"
            wrapperCol={{ offset: 4, span: 16 }}
          >
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
            <Typography.Text type="secondary">
              Don't have an account yet?{" "}
              <NuxtLink href="/register">Register</NuxtLink>
            </Typography.Text>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

Login.getLayout = function getLayout(page) {
  return <AuthLayout>{page}</AuthLayout>;
};
