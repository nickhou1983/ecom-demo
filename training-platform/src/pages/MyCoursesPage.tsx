import { Card, Row, Col, List, Avatar, Tag, Button, Space, Typography, Progress, Tabs, Empty, Statistic } from 'antd';
import { useNavigate } from 'react-router-dom';
import { 
  BookOutlined, 
  PlayCircleOutlined, 
  CheckCircleOutlined,
  ClockCircleOutlined,
  StarOutlined,
  TrophyOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { 
  mockCourses, 
  mockProgress, 
  mockLearningStats 
} from '../data/mockData';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

export default function MyCoursesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // 获取用户的学习进度
  const userProgress = mockProgress.filter(p => p.userId === user?.id);
  const stats = mockLearningStats;

  // 获取用户的课程数据
  const userCourses = userProgress.map(progress => {
    const course = mockCourses.find(c => c.id === progress.courseId);
    return {
      ...course,
      progress: progress,
      status: progress.completedDate ? 'completed' : 'in-progress'
    };
  }).filter(course => course.id); // 过滤掉找不到的课程

  // 按状态分组
  const inProgressCourses = userCourses.filter(course => course.status === 'in-progress');
  const completedCourses = userCourses.filter(course => course.status === 'completed');

  // 渲染课程卡片
  const renderCourseCard = (course: any) => {
    const progress = course.progress;
    const isCompleted = course.status === 'completed';
    const statusColor = isCompleted ? '#52c41a' : 
                       progress.completedPercentage > 50 ? '#1890ff' : '#fa8c16';

    return (
      <Card
        key={course.id}
        style={{ marginBottom: '16px', cursor: 'pointer' }}
        hoverable
        onClick={() => navigate(`/courses/${course.id}`)}
        cover={
          <div style={{ 
            height: '200px', 
            background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${course.thumbnail})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'flex-end',
            padding: '16px'
          }}>
            <div style={{ color: 'white', width: '100%' }}>
              <Text style={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>
                {course.title}
              </Text>
              <div style={{ marginTop: '8px' }}>
                <Progress 
                  percent={progress.completedPercentage} 
                  strokeColor={statusColor}
                  trailColor="rgba(255,255,255,0.3)"
                  showInfo={false}
                />
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginTop: '4px'
                }}>
                  <Text style={{ color: 'white', fontSize: '12px' }}>
                    {progress.completedPercentage}% 完成
                  </Text>
                  <Text style={{ color: 'white', fontSize: '12px' }}>
                    {Math.round(progress.timeSpent / 60)} / {Math.round(course.duration / 60)} 小时
                  </Text>
                </div>
              </div>
            </div>
          </div>
        }
        actions={[
          <Button 
            type="primary" 
            icon={isCompleted ? <CheckCircleOutlined /> : <PlayCircleOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/courses/${course.id}`);
            }}
          >
            {isCompleted ? '复习课程' : '继续学习'}
          </Button>
        ]}
      >
        <Card.Meta
          avatar={
            <Avatar 
              icon={<BookOutlined />} 
              style={{ backgroundColor: statusColor }}
            />
          }
          title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{course.instructor}</span>
              <Space>
                {isCompleted && <Tag color="green">已完成</Tag>}
                <Tag color={
                  course.level === 'beginner' ? 'blue' : 
                  course.level === 'intermediate' ? 'orange' : 'red'
                }>
                  {course.level === 'beginner' ? '初级' : 
                   course.level === 'intermediate' ? '中级' : '高级'}
                </Tag>
                <Tag>{course.category}</Tag>
              </Space>
            </div>
          }
          description={
            <div>
              <Text type="secondary" style={{ marginBottom: '8px', display: 'block' }}>
                {course.description}
              </Text>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Space>
                  <StarOutlined style={{ color: '#faad14' }} />
                  <Text>{course.rating}</Text>
                </Space>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  最后学习: {new Date(progress.lastAccessed).toLocaleDateString('zh-CN')}
                </Text>
              </div>
            </div>
          }
        />
      </Card>
    );
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>
          <BookOutlined style={{ marginRight: '8px' }} />
          我的课程
        </Title>
        <Text type="secondary">
          管理您已注册的课程，继续您的学习之旅
        </Text>
      </div>

      {/* 学习统计概览 */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="总课程数"
              value={userCourses.length}
              suffix="门"
              prefix={<BookOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="进行中"
              value={inProgressCourses.length}
              suffix="门"
              prefix={<PlayCircleOutlined style={{ color: '#fa8c16' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="已完成"
              value={completedCourses.length}
              suffix="门"
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="总学习时长"
              value={Math.round(stats.totalLearningTime / 60)}
              suffix="小时"
              prefix={<ClockCircleOutlined style={{ color: '#eb2f96' }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* 课程列表 */}
      <Card>
        <Tabs defaultActiveKey="all" size="large">
          <TabPane 
            tab={
              <Space>
                <BarChartOutlined />
                全部课程 ({userCourses.length})
              </Space>
            } 
            key="all"
          >
            {userCourses.length === 0 ? (
              <Empty 
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="您还没有注册任何课程"
              >
                <Button type="primary" onClick={() => navigate('/courses')}>
                  浏览课程
                </Button>
              </Empty>
            ) : (
              <Row gutter={[24, 24]}>
                {userCourses.map(course => (
                  <Col xs={24} sm={12} lg={8} key={course.id}>
                    {renderCourseCard(course)}
                  </Col>
                ))}
              </Row>
            )}
          </TabPane>
          
          <TabPane 
            tab={
              <Space>
                <PlayCircleOutlined />
                进行中 ({inProgressCourses.length})
              </Space>
            } 
            key="in-progress"
          >
            {inProgressCourses.length === 0 ? (
              <Empty 
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="没有正在进行中的课程"
              >
                <Button type="primary" onClick={() => navigate('/courses')}>
                  开始新课程
                </Button>
              </Empty>
            ) : (
              <Row gutter={[24, 24]}>
                {inProgressCourses.map(course => (
                  <Col xs={24} sm={12} lg={8} key={course.id}>
                    {renderCourseCard(course)}
                  </Col>
                ))}
              </Row>
            )}
          </TabPane>
          
          <TabPane 
            tab={
              <Space>
                <CheckCircleOutlined />
                已完成 ({completedCourses.length})
              </Space>
            } 
            key="completed"
          >
            {completedCourses.length === 0 ? (
              <Empty 
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="还没有完成任何课程"
              >
                <Button type="primary" onClick={() => navigate('/courses')}>
                  开始学习
                </Button>
              </Empty>
            ) : (
              <Row gutter={[24, 24]}>
                {completedCourses.map(course => (
                  <Col xs={24} sm={12} lg={8} key={course.id}>
                    {renderCourseCard(course)}
                  </Col>
                ))}
              </Row>
            )}
          </TabPane>
        </Tabs>
      </Card>

      {/* 学习建议 */}
      {inProgressCourses.length > 0 && (
        <Card 
          title={
            <Space>
              <TrophyOutlined />
              学习建议
            </Space>
          }
          style={{ marginTop: '24px' }}
        >
          <List
            dataSource={[
              {
                title: '保持学习节奏',
                description: '建议每天至少学习30分钟，保持连续学习的好习惯。',
                icon: <ClockCircleOutlined style={{ color: '#1890ff' }} />
              },
              {
                title: '完成进行中的课程',
                description: `您有${inProgressCourses.length}门课程正在学习中，建议优先完成这些课程。`,
                icon: <PlayCircleOutlined style={{ color: '#fa8c16' }} />
              },
              {
                title: '定期复习',
                description: '定期回顾已学内容，巩固知识点，提高学习效果。',
                icon: <StarOutlined style={{ color: '#faad14' }} />
              }
            ]}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar icon={item.icon} />}
                  title={item.title}
                  description={item.description}
                />
              </List.Item>
            )}
          />
        </Card>
      )}
    </div>
  );
}
