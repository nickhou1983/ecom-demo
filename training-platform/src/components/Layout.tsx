import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, Avatar, Dropdown, Badge, Space, Switch } from 'antd';
import type { MenuProps } from 'antd';
import {
  DashboardOutlined,
  BookOutlined,
  UserOutlined,
  TrophyOutlined,
  SettingOutlined,
  BellOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SunOutlined,
  MoonOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';

const { Header, Sider, Content } = Layout;

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    // 从 localStorage 读取主题设置，如果没有则默认为浅色模式
    return localStorage.getItem('darkMode') === 'true';
  });
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  
  // 当主题模式变化时保存到 localStorage 并应用相应的类
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
    if (darkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [darkMode]);

  const menuItems: MenuProps['items'] = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: t('nav.dashboard'),
      onClick: () => navigate('/dashboard'),
    },
    {
      key: 'courses',
      icon: <BookOutlined />,
      label: t('nav.courses'),
      children: [
        { key: 'all-courses', label: t('nav.allCourses'), onClick: () => navigate('/courses') },
        { key: 'my-courses', label: t('nav.myCourses'), onClick: () => navigate('/courses/my') },
        { key: 'learning', label: t('nav.learning'), onClick: () => navigate('/courses/learning') },
      ],
    },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: t('nav.profile'),
      children: [
        { key: 'profile-info', label: t('nav.profileInfo'), onClick: () => navigate('/profile/info') },
        { key: 'learning-progress', label: t('nav.learningProgress'), onClick: () => navigate('/profile/progress') },
        { key: 'certificates', label: t('nav.certificates'), onClick: () => navigate('/profile/certificates') },
      ],
    },
    {
      key: 'achievements',
      icon: <TrophyOutlined />,
      label: t('nav.achievements'),
      onClick: () => navigate('/achievements'),
    },
  ];

  // 管理员菜单项
  if (user?.role === 'admin') {
    menuItems.push({
      key: 'admin',
      icon: <SettingOutlined />,
      label: t('nav.admin'),
      children: [
        { key: 'admin-courses', label: t('nav.adminCourses'), onClick: () => navigate('/admin/courses') },
        { key: 'admin-users', label: t('nav.adminUsers'), onClick: () => navigate('/admin/users') },
        { key: 'admin-analytics', label: t('nav.adminAnalytics'), onClick: () => navigate('/admin/analytics') },
      ],
    });
  }

  // 根据当前路径获取选中的菜单项
  const getSelectedKeys = () => {
    const path = location.pathname;
    if (path.includes('/courses')) return ['courses'];
    if (path.includes('/profile')) return ['profile'];
    if (path.includes('/achievements')) return ['achievements'];
    if (path.includes('/admin')) return ['admin'];
    return ['dashboard'];
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: t('nav.profile'),
      onClick: () => navigate('/profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: t('nav.settings'),
      onClick: () => navigate('/settings'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: t('nav.logout'),
      onClick: logout,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        theme={darkMode ? 'dark' : 'light'}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div style={{ 
          height: '64px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          borderBottom: darkMode ? '1px solid #303030' : '1px solid #f0f0f0'
        }}>
          {!collapsed ? (
            <h2 style={{ 
              color: darkMode ? '#fff' : '#1890ff',
              margin: 0,
              fontSize: '18px',
              fontWeight: 'bold'
            }}>
              {t('login.title')}
            </h2>
          ) : (
            <BookOutlined style={{ 
              fontSize: '24px', 
              color: darkMode ? '#fff' : '#1890ff' 
            }} />
          )}
        </div>
        <Menu
          theme={darkMode ? 'dark' : 'light'}
          mode="inline"
          selectedKeys={getSelectedKeys()}
          items={menuItems}
          style={{ border: 'none' }}
        />
      </Sider>
      
      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'margin-left 0.2s' }}>
        <Header 
          style={{ 
            padding: '0 24px', 
            background: '#fff', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            boxShadow: '0 1px 4px rgba(0,21,41,.08)',
            position: 'sticky',
            top: 0,
            zIndex: 1
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
          
          <Space size="large">
            <Space>
              <SunOutlined />
              <Switch
                checked={darkMode}
                onChange={setDarkMode}
                checkedChildren={<MoonOutlined />}
                unCheckedChildren={<SunOutlined />}
              />
              <MoonOutlined />
            </Space>
            
            <LanguageSwitcher />
            
            <Badge count={3} size="small">
              <Button 
                type="text" 
                icon={<BellOutlined />} 
                size="large"
              />
            </Badge>
            
            <Dropdown 
              menu={{ items: userMenuItems }} 
              placement="bottomRight"
              arrow
            >
              <Space style={{ cursor: 'pointer' }}>
                <Avatar 
                  src={user?.avatar} 
                  icon={<UserOutlined />}
                  size="default"
                />
                <span style={{ fontWeight: 500 }}>{user?.name}</span>
              </Space>
            </Dropdown>
          </Space>
        </Header>
        
        <Content 
          style={{ 
            padding: '24px',
            background: '#f5f5f5',
            minHeight: 'calc(100vh - 64px)',
            overflow: 'auto'
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
