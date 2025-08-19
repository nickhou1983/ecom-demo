import { Card, Row, Col, List, Avatar, Tag, Button, Space, Typography, Progress, Tabs, Empty, Statistic } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

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
                    {progress.completedPercentage}% {t('myCourses.completed_percent')}
                  </Text>
                  <Text style={{ color: 'white', fontSize: '12px' }}>
                    {Math.round(progress.timeSpent / 60)} / {Math.round(course.duration / 60)} {t('myCourses.hours')}
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
            {isCompleted ? t('myCourses.reviewCourse') : t('myCourses.continueLearning')}
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
                {isCompleted && <Tag color="green">{t('dashboard.status.completed')}</Tag>}
                <Tag color={
                  course.level === 'beginner' ? 'blue' : 
                  course.level === 'intermediate' ? 'orange' : 'red'
                }>
                  {t(`myCourses.levels.${course.level}`)}
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
                  {t('myCourses.lastStudied')}: {new Date(progress.lastAccessed).toLocaleDateString()}
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
          {t('myCourses.title')}
        </Title>
        <Text type="secondary">
          {t('myCourses.subtitle')}
        </Text>
      </div>

      {/* 学习统计概览 */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title={t('myCourses.totalCourses')}
              value={userCourses.length}
              suffix={t('dashboard.courses')}
              prefix={<BookOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title={t('myCourses.inProgress')}
              value={inProgressCourses.length}
              suffix={t('dashboard.courses')}
              prefix={<PlayCircleOutlined style={{ color: '#fa8c16' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title={t('myCourses.completed')}
              value={completedCourses.length}
              suffix={t('dashboard.courses')}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title={t('myCourses.totalLearningTime')}
              value={Math.round(stats.totalLearningTime / 60)}
              suffix={t('myCourses.hours')}
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
                {t('myCourses.allCourses')} ({userCourses.length})
              </Space>
            } 
            key="all"
          >
            {userCourses.length === 0 ? (
              <Empty 
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={t('myCourses.noCoursesEnrolled')}
              >
                <Button type="primary" onClick={() => navigate('/courses')}>
                  {t('myCourses.browseCourses')}
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
                {t('myCourses.inProgressTab')} ({inProgressCourses.length})
              </Space>
            } 
            key="in-progress"
          >
            {inProgressCourses.length === 0 ? (
              <Empty 
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={t('myCourses.noInProgressCourses')}
              >
                <Button type="primary" onClick={() => navigate('/courses')}>
                  {t('myCourses.startNewCourse')}
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
                {t('myCourses.completedTab')} ({completedCourses.length})
              </Space>
            } 
            key="completed"
          >
            {completedCourses.length === 0 ? (
              <Empty 
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={t('myCourses.noCompletedCourses')}
              >
                <Button type="primary" onClick={() => navigate('/courses')}>
                  {t('myCourses.startLearning')}
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
              {t('myCourses.learningTips')}
            </Space>
          }
          style={{ marginTop: '24px' }}
        >
          <List
            dataSource={[
              {
                title: t('myCourses.keepLearningRhythm'),
                description: t('myCourses.keepLearningRhythmDesc'),
                icon: <ClockCircleOutlined style={{ color: '#1890ff' }} />
              },
              {
                title: t('myCourses.completeInProgressCourses'),
                description: `${t('myCourses.completeInProgressCoursesDesc').replace('{count}', inProgressCourses.length.toString())}`,
                icon: <PlayCircleOutlined style={{ color: '#fa8c16' }} />
              },
              {
                title: t('myCourses.regularReview'),
                description: t('myCourses.regularReviewDesc'),
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
