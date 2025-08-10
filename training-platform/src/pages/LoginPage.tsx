import { useState } from 'react';
import { Form, Input, Button, Card, Alert, Divider, Space, Typography } from 'antd';
import { UserOutlined, LockOutlined, BookOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { mockUsers } from '../data/mockData';
import LanguageSwitcher from '../components/LanguageSwitcher';

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
  const { t } = useTranslation();

  const onFinish = async (values: LoginForm) => {
    setLoading(true);
    setError(null);
    
    try {
      const success = await login(values.email, values.password);
      if (!success) {
        setError(t('login.loginError'));
      }
    } catch (err) {
      setError(t('login.loginError'));
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
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
            <LanguageSwitcher />
          </div>
          <BookOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
          <Title level={2} style={{ margin: 0, color: '#262626' }}>
            {t('login.title')}
          </Title>
          <Text type="secondary">
            {t('login.subtitle')}
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
            label={t('login.email')}
            rules={[
              { required: true, message: t('login.emailPlaceholder') },
              { type: 'email', message: t('login.emailPlaceholder') }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder={t('login.emailPlaceholder')}
              autoComplete="email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={t('login.password')}
            rules={[{ required: true, message: t('login.passwordPlaceholder') }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder={t('login.passwordPlaceholder')}
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
              {t('login.login')}
            </Button>
          </Form.Item>
        </Form>

        <Divider>{t('login.demoAccounts')}</Divider>

        <div style={{ background: '#fafafa', padding: '16px', borderRadius: '8px' }}>
          <Text strong style={{ display: 'block', marginBottom: '8px' }}>
            {t('login.demoAccounts')}:
          </Text>
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            {mockUsers.map(user => (
              <div key={user.id} style={{ fontSize: '13px' }}>
                <Text code>{user.email}</Text>
                <Text type="secondary"> ({user.role === 'student' ? t('login.student') : user.role === 'instructor' ? t('login.instructor') : t('login.admin')})</Text>
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
            {t('login.password')}: <Text code>password123</Text>
          </Paragraph>
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            © 2024 {t('login.title')}
          </Text>
        </div>
      </Card>
    </div>
  );
}
