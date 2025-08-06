import { useState } from 'react';
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
import { useAuth } from '../context/AuthContext';

const { Header, Sider, Content } = Layout;

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems: MenuProps['items'] = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: '仪表板',
      onClick: () => navigate('/dashboard'),
    },
    {
      key: 'courses',
      icon: <BookOutlined />,
      label: '课程中心',
      children: [
        { key: 'all-courses', label: '所有课程', onClick: () => navigate('/courses') },
        { key: 'my-courses', label: '我的课程', onClick: () => navigate('/courses/my') },
        { key: 'learning', label: '正在学习', onClick: () => navigate('/courses/learning') },
      ],
    },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
      children: [
        { key: 'profile-info', label: '个人信息', onClick: () => navigate('/profile/info') },
        { key: 'learning-progress', label: '学习进度', onClick: () => navigate('/profile/progress') },
        { key: 'certificates', label: '我的证书', onClick: () => navigate('/profile/certificates') },
      ],
    },
    {
      key: 'achievements',
      icon: <TrophyOutlined />,
      label: '成就中心',
      onClick: () => navigate('/achievements'),
    },
  ];

  // 管理员菜单项
  if (user?.role === 'admin') {
    menuItems.push({
      key: 'admin',
      icon: <SettingOutlined />,
      label: '管理后台',
      children: [
        { key: 'admin-courses', label: '课程管理', onClick: () => navigate('/admin/courses') },
        { key: 'admin-users', label: '用户管理', onClick: () => navigate('/admin/users') },
        { key: 'admin-analytics', label: '数据统计', onClick: () => navigate('/admin/analytics') },
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
      label: '个人资料',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
      onClick: () => navigate('/settings'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
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
              培训平台
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
