import React from 'react';
import { Button, Form, Input, Space } from 'antd';

const SubmitButton = ({ form, children }) => {
  const [submittable, setSubmittable] = React.useState(false);

  // Watch all values
  const values = Form.useWatch([], form);
  React.useEffect(() => {
    form
      .validateFields({
        validateOnly: true,
      })
      .then(() => setSubmittable(true))
      .catch(() => setSubmittable(false));
  }, [form, values]);
  return (
    <Button type="default" htmlType="submit" disabled={!submittable}>
      {children}
    </Button>
  );
};

/*
The form to input and submit City and Country info.
  submitHandler: the function to be called on form submitted.
*/
const CityForm = ({ submitHandler }) => {
  const [form] = Form.useForm();

  return (
    <Form form={form} name="city-form" layout="horizontal" autoComplete="off" onFinish={submitHandler}>
      <Space>
        <Form.Item
          name="City"
          label="City"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="Country"
          label="Country"
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Space>
            <SubmitButton form={form}>Search</SubmitButton>
            <Button htmlType="reset">Clear</Button>
          </Space>
        </Form.Item>
      </Space>
    </Form>
  );
};

export default CityForm;
