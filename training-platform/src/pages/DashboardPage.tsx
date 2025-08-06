import { Card, Row, Col, Statistic, Progress, List, Avatar, Tag, Button, Space, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { 
  BookOutlined, 
  TrophyOutlined, 
  ClockCircleOutlined, 
  CheckCircleOutlined,
  PlayCircleOutlined,
  StarOutlined,
  RightOutlined,
  FireOutlined
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { mockCourses, mockProgress, mockNotifications } from '../data/mockData';

const { Title, Text } = Typography;

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // 计算学习统计
  const userProgress = mockProgress.filter(p => p.userId === user?.id);
  const completedCourses = userProgress.filter(p => p.completedDate).length;
  const inProgressCourses = userProgress.filter(p => !p.completedDate).length;
  const totalLearningTime = userProgress.reduce((total, p) => total + p.timeSpent, 0);

  // 推荐课程（示例逻辑）
  const recommendedCourses = mockCourses.slice(0, 3);

  // 最新通知
  const recentNotifications = mockNotifications
    .filter(n => n.userId === user?.id)
    .slice(0, 5);

  // 学习进度数据
  const learningProgressData = userProgress.map(progress => {
    const course = mockCourses.find(c => c.id === progress.courseId);
    return {
      ...progress,
      courseName: course?.title || '未知课程',
      courseCategory: course?.category || '其他'
    };
  });

  return (
    <div>
      {/* 欢迎信息 */}
      <Card style={{ marginBottom: '24px' }}>
        <Row align="middle">
          <Col>
            <Avatar size={64} src={user?.avatar} icon={<BookOutlined />} />
          </Col>
          <Col flex={1} style={{ marginLeft: '16px' }}>
            <Title level={2} style={{ margin: 0 }}>
              欢迎回来，{user?.name}！
            </Title>
            <Text type="secondary">
              继续您的学习之旅，探索更多知识领域
            </Text>
          </Col>
          <Col>
            <Space>
              <Tag color="blue" icon={<FireOutlined />}>
                学习天数: 15
              </Tag>
              <Tag color="green" icon={<TrophyOutlined />}>
                积分: 1,250
              </Tag>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 统计卡片 */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="已完成课程"
              value={completedCourses}
              suffix="门"
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="进行中课程"
              value={inProgressCourses}
              suffix="门"
              prefix={<PlayCircleOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="学习时长"
              value={Math.round(totalLearningTime / 60)}
              suffix="小时"
              prefix={<ClockCircleOutlined style={{ color: '#fa8c16' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="获得证书"
              value={1}
              suffix="张"
              prefix={<TrophyOutlined style={{ color: '#eb2f96' }} />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        {/* 学习进度 */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <BookOutlined />
                我的学习进度
              </Space>
            }
            extra={<Button type="link">查看全部 <RightOutlined /></Button>}
            style={{ height: '400px' }}
          >
            <List
              dataSource={learningProgressData}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{item.courseName}</span>
                        <Tag color="blue">{item.courseCategory}</Tag>
                      </div>
                    }
                    description={
                      <div>
                        <Progress 
                          percent={item.completedPercentage} 
                          size="small" 
                          style={{ marginBottom: '4px' }}
                        />
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          已学习 {Math.round(item.timeSpent / 60)} 小时
                        </Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 推荐课程 */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <StarOutlined />
                推荐课程
              </Space>
            }
            extra={<Button type="link">浏览更多 <RightOutlined /></Button>}
            style={{ height: '400px' }}
          >
            <List
              dataSource={recommendedCourses}
              renderItem={(course) => (
                <List.Item
                  actions={[
                    <Button type="primary" size="small" onClick={() => navigate(`/courses/${course.id}`)}>
                      开始学习
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        shape="square" 
                        size={48} 
                        src={course.thumbnail}
                        icon={<BookOutlined />}
                      />
                    }
                    title={
                      <div>
                        <div>{course.title}</div>
                        <Space size="small" style={{ marginTop: '4px' }}>
                          <Tag color="orange">{course.level}</Tag>
                          <Tag>{course.category}</Tag>
                        </Space>
                      </div>
                    }
                    description={
                      <div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {course.instructor} • {Math.round(course.duration / 60)}小时 • ⭐ {course.rating}
                        </Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* 最新通知 */}
      <Card 
        title="最新通知" 
        style={{ marginTop: '24px' }}
        extra={<Button type="link">查看全部 <RightOutlined /></Button>}
      >
        <List
          dataSource={recentNotifications}
          renderItem={(notification) => (
            <List.Item
              actions={[
                <Button type="link" size="small">
                  查看详情
                </Button>
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar 
                    icon={
                      notification.type === 'course' ? <BookOutlined /> : 
                      notification.type === 'certificate' ? <TrophyOutlined /> : 
                      <CheckCircleOutlined />
                    } 
                    style={{
                      backgroundColor: 
                        notification.type === 'course' ? '#1890ff' : 
                        notification.type === 'certificate' ? '#52c41a' : 
                        '#fa8c16'
                    }}
                  />
                }
                title={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{notification.title}</span>
                    {!notification.isRead && <Tag color="red">新</Tag>}
                  </div>
                }
                description={
                  <div>
                    <div>{notification.content}</div>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {new Date(notification.createdAt).toLocaleString('zh-CN')}
                    </Text>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}
