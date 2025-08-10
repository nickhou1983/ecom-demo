import { useState } from 'react';
import { 
  Typography, 
  List, 
  Tag, 
  Button, 
  Space, 
  Card, 
  Empty, 
  Tabs,
  Badge
} from 'antd';
import { 
  BellOutlined, 
  ClockCircleOutlined, 
  CheckOutlined
} from '@ant-design/icons';
import { mockNotifications } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import type { Notification } from '../types';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

export default function NotificationsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  
  // 获取当前用户的通知
  const userNotifications = mockNotifications.filter(notif => notif.userId === user?.id);
  
  // 根据状态分类通知
  const unreadNotifications = userNotifications.filter(notif => !notif.isRead);
  // 已读通知 (虽然现在没用到，但保留以便未来功能扩展)
  // const readNotifications = userNotifications.filter(notif => notif.isRead);
  
  // 根据类型筛选通知
  const getNotificationsByType = (type?: string) => {
    if (!type || type === 'all') return userNotifications;
    return userNotifications.filter(notif => notif.type === type);
  };

  const currentNotifications = getNotificationsByType(activeTab);

  // 根据通知类型返回标签颜色
  const getTagColor = (type: string) => {
    switch (type) {
      case 'course':
        return 'blue';
      case 'certificate':
        return 'green';
      case 'assignment':
        return 'orange';
      case 'system':
        return 'red';
      default:
        return 'default';
    }
  };
  
  // 根据通知类型返回标签文本
  const getTagText = (type: string) => {
    switch (type) {
      case 'course':
        return '课程';
      case 'certificate':
        return '证书';
      case 'assignment':
        return '作业';
      case 'system':
        return '系统';
      default:
        return '其他';
    }
  };

  // 格式化日期
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <div className="notifications-page">
      <Card>
        <Title level={3}>
          <Space>
            <BellOutlined />
            通知中心
          </Space>
        </Title>

        <Tabs 
          defaultActiveKey="all"
          onChange={(key) => setActiveTab(key)}
        >
          <TabPane 
            tab={<span>全部通知 <Badge count={userNotifications.length} style={{ marginLeft: 5 }} /></span>}
            key="all"
          />
          <TabPane 
            tab={<span>未读通知 <Badge count={unreadNotifications.length} style={{ marginLeft: 5 }} /></span>}
            key="unread"
          />
          <TabPane tab="课程通知" key="course" />
          <TabPane tab="证书通知" key="certificate" />
          <TabPane tab="系统通知" key="system" />
        </Tabs>
        
        {currentNotifications.length === 0 ? (
          <Empty 
            description="暂无通知" 
            style={{ margin: '40px 0' }}
          />
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={currentNotifications}
            renderItem={(item: Notification) => (
              <List.Item
                actions={[
                  <Button type="link" size="small" href={item.actionUrl}>
                    查看详情
                  </Button>,
                  !item.isRead && (
                    <Button type="text" size="small" icon={<CheckOutlined />}>
                      标记为已读
                    </Button>
                  )
                ]}
                style={{ 
                  background: item.isRead ? 'transparent' : '#f0f7ff',
                  padding: '12px',
                  borderRadius: '4px',
                  marginBottom: '8px'
                }}
              >
                <List.Item.Meta
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Space>
                        {!item.isRead && (
                          <Badge status="processing" color="#1890ff" />
                        )}
                        {item.title}
                        <Tag color={getTagColor(item.type)}>
                          {getTagText(item.type)}
                        </Tag>
                      </Space>
                    </div>
                  }
                  description={
                    <>
                      <div>{item.content}</div>
                      <div style={{ marginTop: '5px' }}>
                        <Space>
                          <ClockCircleOutlined style={{ fontSize: '12px' }} />
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            {formatDate(item.createdAt)}
                          </Text>
                        </Space>
                      </div>
                    </>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  );
}
