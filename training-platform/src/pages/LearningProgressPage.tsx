import { Card, Row, Col, Progress, List, Avatar, Tag, Button, Space, Typography, Statistic, Timeline } from 'antd';
import { 
  BookOutlined, 
  TrophyOutlined, 
  ClockCircleOutlined, 
  CheckCircleOutlined,
  PlayCircleOutlined,
  StarOutlined,
  FireOutlined,
  CalendarOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { 
  mockCourses, 
  mockProgress, 
  mockLearningStats,
  mockLearningActivities 
} from '../data/mockData';

const { Title, Text } = Typography;

export default function LearningProgressPage() {
  const { user } = useAuth();

  // 获取用户学习进度
  const userProgress = mockProgress.filter(p => p.userId === user?.id);
  const stats = mockLearningStats;
  const recentActivities = mockLearningActivities
    .filter(a => a.userId === user?.id)
    .slice(0, 10);

  // 学习进度数据
  const learningProgressData = userProgress.map(progress => {
    const course = mockCourses.find(c => c.id === progress.courseId);
    return {
      ...progress,
      courseName: course?.title || '未知课程',
      courseCategory: course?.category || '其他',
      courseInstructor: course?.instructor || '未知讲师',
      courseDuration: course?.duration || 0
    };
  });

  // 按状态分组的课程
  const completedCourses = learningProgressData.filter(p => p.completedDate);
  const inProgressCourses = learningProgressData.filter(p => !p.completedDate);

  // 最近7天的学习活动
  const recentSevenDaysActivities = recentActivities.filter(activity => {
    const activityDate = new Date(activity.timestamp);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return activityDate >= sevenDaysAgo;
  });

  return (
    <div style={{ padding: '24px' }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>
          <BookOutlined style={{ marginRight: '8px' }} />
          我的学习进度
        </Title>
        <Text type="secondary">
          追踪您的学习成果，掌握学习节奏
        </Text>
      </div>

      {/* 学习统计概览 */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总学习时长"
              value={Math.round(stats.totalLearningTime / 60)}
              suffix="小时"
              prefix={<ClockCircleOutlined style={{ color: '#1890ff' }} />}
            />
            <div style={{ marginTop: '8px' }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                本周: {Math.round(stats.currentWeekTime / 60)}小时
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="完成课程"
              value={stats.completedCourses}
              suffix="门"
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            />
            <div style={{ marginTop: '8px' }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                完成率: {stats.completionRate}%
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="连续学习"
              value={stats.currentStreak}
              suffix="天"
              prefix={<FireOutlined style={{ color: '#fa8c16' }} />}
            />
            <div style={{ marginTop: '8px' }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                最长: {stats.longestStreak}天
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="累计积分"
              value={stats.totalPoints}
              prefix={<TrophyOutlined style={{ color: '#eb2f96' }} />}
            />
            <div style={{ marginTop: '8px' }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                本周新增: 150分
              </Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 本周学习目标 */}
      <Card style={{ marginBottom: '24px' }}>
        <Title level={4}>
          <BarChartOutlined style={{ marginRight: '8px' }} />
          本周学习目标
        </Title>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <Text>学习时长进度</Text>
                <Text strong>{Math.round(stats.currentWeekTime / 60)}/{Math.round(stats.weeklyGoal / 60)}小时</Text>
              </div>
              <Progress 
                percent={stats.weeklyProgress} 
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
              />
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <Text>活动完成进度</Text>
                <Text strong>{recentSevenDaysActivities.length}/10次</Text>
              </div>
              <Progress 
                percent={(recentSevenDaysActivities.length / 10) * 100} 
                strokeColor={{
                  '0%': '#fa541c',
                  '100%': '#faad14',
                }}
              />
            </div>
          </Col>
        </Row>
      </Card>

      <Row gutter={[24, 24]}>
        {/* 进行中的课程 */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <PlayCircleOutlined />
                进行中的课程 ({inProgressCourses.length})
              </Space>
            }
            style={{ height: '500px' }}
          >
            <div style={{ height: 'calc(100% - 50px)', overflowY: 'auto' }}>
              <List
                dataSource={inProgressCourses}
                renderItem={(item) => {
                  const statusColor = item.completedPercentage > 50 ? '#1890ff' : '#fa8c16';
                  
                  return (
                    <List.Item style={{ 
                      padding: '16px 0', 
                      borderBottom: '1px solid #f0f0f0'
                    }}>
                      <List.Item.Meta
                        avatar={
                          <Avatar 
                            size={48} 
                            icon={<BookOutlined />}
                            style={{ 
                              backgroundColor: statusColor,
                              border: `2px solid ${statusColor}20`
                            }}
                          />
                        }
                        title={
                          <div>
                            <div style={{ marginBottom: '4px' }}>
                              <Text strong>{item.courseName}</Text>
                            </div>
                            <Space size="small">
                              <Tag color={statusColor} style={{ fontSize: '11px' }}>
                                {item.completedPercentage > 50 ? '进行中' : '刚开始'}
                              </Tag>
                              <Tag style={{ fontSize: '11px' }}>{item.courseCategory}</Tag>
                            </Space>
                          </div>
                        }
                        description={
                          <div>
                            <div style={{ marginBottom: '8px' }}>
                              <Progress 
                                percent={item.completedPercentage} 
                                size="small" 
                                strokeColor={statusColor}
                                showInfo={false}
                              />
                              <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between',
                                marginTop: '4px'
                              }}>
                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                  进度: {item.completedPercentage}%
                                </Text>
                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                  {Math.round(item.timeSpent / 60)} / {Math.round(item.courseDuration / 60)} 小时
                                </Text>
                              </div>
                            </div>
                            <div style={{ 
                              display: 'flex', 
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}>
                              <Text type="secondary" style={{ fontSize: '11px' }}>
                                最后学习: {new Date(item.lastAccessed).toLocaleDateString('zh-CN')}
                              </Text>
                              <Button type="primary" size="small">
                                继续学习
                              </Button>
                            </div>
                          </div>
                        }
                      />
                    </List.Item>
                  );
                }}
              />
            </div>
          </Card>
        </Col>

        {/* 已完成的课程 */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <CheckCircleOutlined />
                已完成的课程 ({completedCourses.length})
              </Space>
            }
            style={{ height: '500px' }}
          >
            <div style={{ height: 'calc(100% - 50px)', overflowY: 'auto' }}>
              <List
                dataSource={completedCourses}
                renderItem={(item) => (
                  <List.Item style={{ 
                    padding: '16px 0', 
                    borderBottom: '1px solid #f0f0f0'
                  }}>
                    <List.Item.Meta
                      avatar={
                        <div style={{ position: 'relative' }}>
                          <Avatar 
                            size={48} 
                            icon={<BookOutlined />}
                            style={{ 
                              backgroundColor: '#52c41a',
                              border: '2px solid #52c41a20'
                            }}
                          />
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
                        </div>
                      }
                      title={
                        <div>
                          <div style={{ marginBottom: '4px' }}>
                            <Text strong>{item.courseName}</Text>
                          </div>
                          <Space size="small">
                            <Tag color="green" style={{ fontSize: '11px' }}>已完成</Tag>
                            <Tag style={{ fontSize: '11px' }}>{item.courseCategory}</Tag>
                          </Space>
                        </div>
                      }
                      description={
                        <div>
                          <Progress 
                            percent={100} 
                            size="small" 
                            strokeColor="#52c41a"
                            showInfo={false}
                          />
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            marginTop: '8px'
                          }}>
                            <Text type="secondary" style={{ fontSize: '11px' }}>
                              学习时长: {Math.round(item.timeSpent / 60)} 小时
                            </Text>
                            <Text type="success" style={{ fontSize: '11px' }}>
                              完成于: {new Date(item.completedDate!).toLocaleDateString('zh-CN')}
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

      {/* 学习活动时间线 */}
      <Card 
        title={
          <Space>
            <CalendarOutlined />
            最近学习活动
          </Space>
        }
        style={{ marginTop: '24px' }}
      >
        <Timeline
          items={recentActivities.map(activity => {
            const getActivityIcon = (type: string) => {
              switch (type) {
                case 'lesson_completed':
                  return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
                case 'quiz_passed':
                  return <TrophyOutlined style={{ color: '#fa8c16' }} />;
                case 'course_started':
                  return <PlayCircleOutlined style={{ color: '#1890ff' }} />;
                case 'certificate_earned':
                  return <StarOutlined style={{ color: '#eb2f96' }} />;
                default:
                  return <BookOutlined />;
              }
            };

            return {
              dot: getActivityIcon(activity.type),
              children: (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <Text strong>{activity.title}</Text>
                    <Tag color="orange" style={{ fontSize: '11px' }}>
                      +{activity.points} 积分
                    </Tag>
                  </div>
                  <div style={{ marginBottom: '4px' }}>
                    <Text type="secondary">{activity.description}</Text>
                  </div>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {new Date(activity.timestamp).toLocaleString('zh-CN')}
                  </Text>
                </div>
              )
            };
          })}
        />
      </Card>
    </div>
  );
}
