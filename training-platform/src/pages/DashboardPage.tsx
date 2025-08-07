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
import { 
  mockCourses, 
  mockProgress, 
  mockNotifications, 
  mockLearningStats,
  mockLearningActivities 
} from '../data/mockData';

const { Title, Text } = Typography;

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // 计算学习统计
  const userProgress = mockProgress.filter(p => p.userId === user?.id);

  // 使用模拟统计数据
  const stats = mockLearningStats;

  // 推荐课程（示例逻辑）
  const recommendedCourses = mockCourses.slice(0, 3);

  // 最新通知
  const recentNotifications = mockNotifications
    .filter(n => n.userId === user?.id)
    .slice(0, 5);

  // 最近学习活动
  const recentActivities = mockLearningActivities
    .filter(a => a.userId === user?.id)
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
                连续学习: {stats.currentStreak}天
              </Tag>
              <Tag color="green" icon={<TrophyOutlined />}>
                积分: {stats.totalPoints}
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
              value={stats.completedCourses}
              suffix="门"
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="进行中课程"
              value={stats.inProgressCourses}
              suffix="门"
              prefix={<PlayCircleOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="学习时长"
              value={Math.round(stats.totalLearningTime / 60)}
              suffix="小时"
              prefix={<ClockCircleOutlined style={{ color: '#fa8c16' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="本周进度"
              value={stats.weeklyProgress}
              suffix="%"
              prefix={<TrophyOutlined style={{ color: '#eb2f96' }} />}
            />
            <div style={{ marginTop: '8px' }}>
              <Progress 
                percent={stats.weeklyProgress} 
                size="small" 
                strokeColor="#eb2f96"
                showInfo={false}
              />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                目标: {Math.round(stats.weeklyGoal / 60)}小时/周
              </Text>
            </div>
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
            style={{ height: '500px' }}
          >
            {learningProgressData.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px 0', 
                color: '#999',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%'
              }}>
                <BookOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                <Text type="secondary">暂无数据</Text>
              </div>
            ) : (
              <div style={{ height: 'calc(100% - 50px)', overflowY: 'auto' }}>
                <List
                  dataSource={learningProgressData}
                  renderItem={(item) => {
                    const statusColor = item.completedPercentage === 100 ? '#52c41a' : 
                                      item.completedPercentage > 50 ? '#1890ff' : '#fa8c16';
                    const statusText = item.completedPercentage === 100 ? '已完成' : 
                                     item.completedPercentage > 50 ? '进行中' : '刚开始';
                    
                    return (
                      <List.Item style={{ 
                        padding: '16px 0', 
                        borderBottom: '1px solid #f0f0f0',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                      }}>
                        <List.Item.Meta
                          avatar={
                            <div style={{ position: 'relative' }}>
                              <Avatar 
                                size={48} 
                                icon={<BookOutlined />}
                                style={{ 
                                  backgroundColor: statusColor,
                                  border: `2px solid ${statusColor}20`
                                }}
                              />
                              {item.completedPercentage === 100 && (
                                <CheckCircleOutlined 
                                  style={{ 
                                    position: 'absolute',
                                    bottom: -2,
                                    right: -2,
                                    color: '#52c41a',
                                    backgroundColor: 'white',
                                    borderRadius: '50%',
                                    fontSize: '16px'
                                  }}
                                />
                              )}
                            </div>
                          }
                          title={
                            <div style={{ marginBottom: '8px' }}>
                              <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'flex-start',
                                marginBottom: '4px'
                              }}>
                                <Text strong style={{ fontSize: '14px' }}>
                                  {item.courseName}
                                </Text>
                                <Space size="small">
                                  <Tag color={statusColor} style={{ fontSize: '11px', padding: '0 6px' }}>
                                    {statusText}
                                  </Tag>
                                  <Tag style={{ fontSize: '11px', padding: '0 6px' }}>{item.courseCategory}</Tag>
                                </Space>
                              </div>
                            </div>
                          }
                          description={
                            <div>
                              <div style={{ marginBottom: '8px' }}>
                                <div style={{ 
                                  display: 'flex', 
                                  justifyContent: 'space-between', 
                                  alignItems: 'center',
                                  marginBottom: '4px'
                                }}>
                                  <Text type="secondary" style={{ fontSize: '12px' }}>
                                    进度: {item.completedPercentage}%
                                  </Text>
                                  <Text type="secondary" style={{ fontSize: '12px' }}>
                                    {Math.round(item.timeSpent / 60)} 小时
                                  </Text>
                                </div>
                                <Progress 
                                  percent={item.completedPercentage} 
                                  size="small" 
                                  strokeColor={statusColor}
                                  trailColor="#f0f0f0"
                                  showInfo={false}
                                />
                              </div>
                              <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between',
                                alignItems: 'center'
                              }}>
                                <Text type="secondary" style={{ fontSize: '11px' }}>
                                  最后学习: {new Date(item.lastAccessed).toLocaleDateString('zh-CN')}
                                </Text>
                                {item.completedDate ? (
                                  <Text type="success" style={{ fontSize: '11px' }}>
                                    完成于: {new Date(item.completedDate).toLocaleDateString('zh-CN')}
                                  </Text>
                                ) : (
                                  <Button 
                                    type="primary" 
                                    size="small"
                                    onClick={() => navigate(`/courses/${item.courseId}`)}
                                  >
                                    继续学习
                                  </Button>
                                )}
                              </div>
                            </div>
                          }
                        />
                      </List.Item>
                    );
                  }}
                />
              </div>
            )}
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
            style={{ height: '500px' }}
          >
            <div style={{ height: 'calc(100% - 50px)', overflowY: 'auto' }}>
              <List
                dataSource={recommendedCourses}
                renderItem={(course) => (
                  <List.Item
                    style={{ 
                      padding: '16px 0', 
                      borderBottom: '1px solid #f0f0f0',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
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
                          style={{ borderRadius: '6px' }}
                        />
                      }
                      title={
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '4px' }}>
                            {course.title}
                          </div>
                          <Space size="small" style={{ marginTop: '4px' }}>
                            <Tag 
                              color={
                                course.level === 'beginner' ? 'green' : 
                                course.level === 'intermediate' ? 'orange' : 'red'
                              }
                              style={{ fontSize: '11px', padding: '0 6px' }}
                            >
                              {course.level === 'beginner' ? '初级' : 
                               course.level === 'intermediate' ? '中级' : '高级'}
                            </Tag>
                            <Tag style={{ fontSize: '11px', padding: '0 6px' }}>{course.category}</Tag>
                          </Space>
                        </div>
                      }
                      description={
                        <div>
                          <div style={{ marginBottom: '8px' }}>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              {course.instructor} • {Math.round(course.duration / 60)}小时 • ⭐ {course.rating}
                            </Text>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text type="secondary" style={{ fontSize: '11px' }}>
                              {course.enrolledCount} 人已学习
                            </Text>
                          </div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* 最近学习活动 */}
      <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <ClockCircleOutlined />
                最近学习活动
              </Space>
            }
            extra={<Button type="link">查看全部 <RightOutlined /></Button>}
          >
            <List
              dataSource={recentActivities}
              renderItem={(activity) => {
                const getActivityIcon = (type: string) => {
                  switch (type) {
                    case 'lesson_completed':
                      return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
                    case 'quiz_passed':
                      return <TrophyOutlined style={{ color: '#fa8c16' }} />;
                    case 'course_started':
                      return <PlayCircleOutlined style={{ color: '#1890ff' }} />;
                    case 'certificate_earned':
                      return <TrophyOutlined style={{ color: '#eb2f96' }} />;
                    default:
                      return <BookOutlined />;
                  }
                };

                const getActivityColor = (type: string) => {
                  switch (type) {
                    case 'lesson_completed':
                      return '#52c41a';
                    case 'quiz_passed':
                      return '#fa8c16';
                    case 'course_started':
                      return '#1890ff';
                    case 'certificate_earned':
                      return '#eb2f96';
                    default:
                      return '#1890ff';
                  }
                };

                return (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar 
                          icon={getActivityIcon(activity.type)}
                          style={{ backgroundColor: getActivityColor(activity.type) }}
                        />
                      }
                      title={
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span>{activity.title}</span>
                          <Tag color="orange" style={{ fontSize: '11px', padding: '0 6px' }}>
                            +{activity.points} 积分
                          </Tag>
                        </div>
                      }
                      description={
                        <div>
                          <div style={{ marginBottom: '4px' }}>
                            {activity.description}
                          </div>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            {new Date(activity.timestamp).toLocaleString('zh-CN')}
                          </Text>
                        </div>
                      }
                    />
                  </List.Item>
                );
              }}
            />
          </Card>
        </Col>

        {/* 学习统计概览 */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <TrophyOutlined />
                学习统计概览
              </Space>
            }
          >
            <Row gutter={[16, 16]}>
              <Col xs={12}>
                <div style={{ textAlign: 'center', padding: '16px' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                    {stats.currentStreak}
                  </div>
                  <Text type="secondary">连续学习天数</Text>
                </div>
              </Col>
              <Col xs={12}>
                <div style={{ textAlign: 'center', padding: '16px' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                    {stats.completionRate}%
                  </div>
                  <Text type="secondary">课程完成率</Text>
                </div>
              </Col>
              <Col xs={12}>
                <div style={{ textAlign: 'center', padding: '16px' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fa8c16' }}>
                    {stats.averageSessionTime}
                  </div>
                  <Text type="secondary">平均学习时长(分钟)</Text>
                </div>
              </Col>
              <Col xs={12}>
                <div style={{ textAlign: 'center', padding: '16px' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#eb2f96' }}>
                    {stats.favoriteCategory}
                  </div>
                  <Text type="secondary">最喜欢的分类</Text>
                </div>
              </Col>
            </Row>
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
