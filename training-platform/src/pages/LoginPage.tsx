import { useState } from 'react';
import { Form, Input, Button, Card, Alert, Divider, Space, Typography } from 'antd';
import { UserOutlined, LockOutlined, BookOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { mockUsers } from '../data/mockData';

const { Title, Text, Paragraph } = Typography;

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const onFinish = async (values: LoginForm) => {
    setLoading(true);
    setError(null);
    
    try {
      const success = await login(values.email, values.password);
      if (!success) {
        setError('邮箱或密码错误，请检查后重试');
      }
    } catch (err) {
      setError('登录失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <Card
        style={{
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          borderRadius: '12px'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <BookOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
          <Title level={2} style={{ margin: 0, color: '#262626' }}>
            企业培训平台
          </Title>
          <Text type="secondary">
            欢迎登录学习管理系统
          </Text>
        </div>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            style={{ marginBottom: '24px' }}
          />
        )}

        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          size="large"
          layout="vertical"
        >
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="请输入邮箱"
              autoComplete="email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="密码"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请输入密码"
              autoComplete="current-password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
              style={{ height: '48px', fontSize: '16px' }}
            >
              登录
            </Button>
          </Form.Item>
        </Form>

        <Divider>演示账号</Divider>

        <div style={{ background: '#fafafa', padding: '16px', borderRadius: '8px' }}>
          <Text strong style={{ display: 'block', marginBottom: '8px' }}>
            可用测试账号：
          </Text>
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            {mockUsers.map(user => (
              <div key={user.id} style={{ fontSize: '13px' }}>
                <Text code>{user.email}</Text>
                <Text type="secondary"> ({user.role === 'student' ? '学员' : user.role === 'instructor' ? '讲师' : '管理员'})</Text>
              </div>
            ))}
          </Space>
          <Paragraph 
            style={{ 
              marginTop: '12px', 
              marginBottom: 0, 
              fontSize: '13px',
              color: '#666'
            }}
          >
            统一密码：<Text code>password123</Text>
          </Paragraph>
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            © 2024 企业培训平台. 技术支持
          </Text>
        </div>
      </Card>
    </div>
  );
}
