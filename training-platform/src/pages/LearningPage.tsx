import { Card, Row, Col, List, Avatar, Tag, Button, Space, Typography, Progress, Empty, Statistic, Badge, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';
import { 
  BookOutlined, 
  PlayCircleOutlined, 
  ClockCircleOutlined,
  StarOutlined,
  FireOutlined,
  CalendarOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { 
  mockCourses, 
  mockProgress, 
  mockLearningStats 
} from '../data/mockData';

const { Title, Text } = Typography;

export default function LearningPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // 获取用户的学习进度
  const userProgress = mockProgress.filter(p => p.userId === user?.id);
  const stats = mockLearningStats;

  // 获取正在学习的课程
  const learningCourses = userProgress
    .filter(progress => !progress.completedDate)
    .map(progress => {
      const course = mockCourses.find(c => c.id === progress.courseId);
      return {
        ...course,
        progress: progress,
        urgency: getUrgency(progress)
      };
    })
    .filter(course => course.id)
    .sort((a, b) => new Date(b.progress.lastAccessed).getTime() - new Date(a.progress.lastAccessed).getTime());

  // 计算学习紧急程度
  function getUrgency(progress: any) {
    const daysSinceLastAccess = Math.floor(
      (new Date().getTime() - new Date(progress.lastAccessed).getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysSinceLastAccess > 7) return 'high';
    if (daysSinceLastAccess > 3) return 'medium';
    return 'low';
  }

  // 获取紧急程度颜色
  function getUrgencyColor(urgency: string) {
    switch (urgency) {
      case 'high': return '#ff4d4f';
      case 'medium': return '#faad14';
      default: return '#52c41a';
    }
  }

  // 获取紧急程度文本
  function getUrgencyText(urgency: string) {
    switch (urgency) {
      case 'high': return '需要关注';
      case 'medium': return '适度关注';
      default: return '学习良好';
    }
  }

  // 计算今日推荐学习课程
  const todayRecommended = learningCourses.slice(0, 2);

  return (
    <div style={{ padding: '24px' }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>
          <PlayCircleOutlined style={{ marginRight: '8px' }} />
          正在学习
        </Title>
        <Text type="secondary">
          继续您的学习之旅，保持学习节奏
        </Text>
      </div>

      {/* 学习概览统计 */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="进行中课程"
              value={learningCourses.length}
              suffix="门"
              prefix={<BookOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="本周学习"
              value={Math.round(stats.currentWeekTime / 60)}
              suffix="小时"
              prefix={<ClockCircleOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="连续学习"
              value={stats.currentStreak}
              suffix="天"
              prefix={<FireOutlined style={{ color: '#fa8c16' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="平均进度"
              value={Math.round(learningCourses.reduce((sum, course) => sum + course.progress.completedPercentage, 0) / learningCourses.length || 0)}
              suffix="%"
              prefix={<TrophyOutlined style={{ color: '#eb2f96' }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* 今日推荐学习 */}
      {todayRecommended.length > 0 && (
        <Card 
          title={
            <Space>
              <StarOutlined />
              今日推荐学习
            </Space>
          }
          style={{ marginBottom: '24px' }}
        >
          <Row gutter={[16, 16]}>
            {todayRecommended.map(course => (
              <Col xs={24} md={12} key={course.id}>
                <Card
                  size="small"
                  hoverable
                  onClick={() => navigate(`/courses/${course.id}`)}
                  style={{ 
                    border: '2px solid #1890ff',
                    background: 'linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 100%)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar 
                      size={48} 
                      src={course.thumbnail}
                      icon={<BookOutlined />}
                      style={{ marginRight: '12px' }}
                    />
                    <div style={{ flex: 1 }}>
                      <Text strong style={{ display: 'block', marginBottom: '4px' }}>
                        {course.title}
                      </Text>
                      <Progress 
                        percent={course.progress.completedPercentage} 
                        size="small"
                        showInfo={false}
                        strokeColor="#1890ff"
                      />
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        继续第 {course.progress.currentLesson} 章节
                      </Text>
                    </div>
                    <Button type="primary" size="small">
                      继续学习
                    </Button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      )}

      {/* 所有正在学习的课程 */}
      <Card 
        title={
          <Space>
            <BookOutlined />
            所有学习中的课程 ({learningCourses.length})
          </Space>
        }
      >
        {learningCourses.length === 0 ? (
          <Empty 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="您还没有正在学习的课程"
          >
            <Button type="primary" onClick={() => navigate('/courses')}>
              开始学习新课程
            </Button>
          </Empty>
        ) : (
          <List
            dataSource={learningCourses}
            renderItem={course => {
              const progress = course.progress;
              const statusColor = progress.completedPercentage > 50 ? '#1890ff' : '#fa8c16';
              const urgencyColor = getUrgencyColor(course.urgency);
              const daysSinceLastAccess = Math.floor(
                (new Date().getTime() - new Date(progress.lastAccessed).getTime()) / (1000 * 60 * 60 * 24)
              );

              return (
                <List.Item
                  style={{ 
                    padding: '16px 0', 
                    borderBottom: '1px solid #f0f0f0',
                    cursor: 'pointer'
                  }}
                  onClick={() => navigate(`/courses/${course.id}`)}
                  actions={[
                    <Tooltip title={getUrgencyText(course.urgency)}>
                      <Badge 
                        color={urgencyColor} 
                        text={
                          <Text style={{ fontSize: '12px' }}>
                            {daysSinceLastAccess === 0 ? '今天学习' : 
                             daysSinceLastAccess === 1 ? '昨天学习' : 
                             `${daysSinceLastAccess}天前学习`}
                          </Text>
                        } 
                      />
                    </Tooltip>,
                    <Button 
                      type="primary" 
                      size="small"
                      icon={<PlayCircleOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/courses/${course.id}`);
                      }}
                    >
                      继续学习
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <div style={{ position: 'relative' }}>
                        <Avatar 
                          size={64} 
                          src={course.thumbnail}
                          icon={<BookOutlined />}
                          style={{ 
                            border: `3px solid ${statusColor}20`
                          }}
                        />
                        <div style={{
                          position: 'absolute',
                          bottom: -8,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          background: statusColor,
                          color: 'white',
                          fontSize: '10px',
                          padding: '2px 6px',
                          borderRadius: '10px',
                          fontWeight: 'bold'
                        }}>
                          {progress.completedPercentage}%
                        </div>
                      </div>
                    }
                    title={
                      <div>
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          marginBottom: '8px'
                        }}>
                          <Text strong style={{ fontSize: '16px' }}>
                            {course.title}
                          </Text>
                          <Space>
                            <Tag color={statusColor}>
                              {progress.completedPercentage > 50 ? '进行中' : '刚开始'}
                            </Tag>
                            <Tag>{course.category}</Tag>
                          </Space>
                        </div>
                        <Progress 
                          percent={progress.completedPercentage} 
                          strokeColor={statusColor}
                          trailColor="#f0f0f0"
                          showInfo={false}
                          style={{ marginBottom: '8px' }}
                        />
                      </div>
                    }
                    description={
                      <div>
                        <Row gutter={[16, 8]}>
                          <Col span={12}>
                            <Space size="small">
                              <CalendarOutlined style={{ color: '#999' }} />
                              <Text type="secondary" style={{ fontSize: '12px' }}>
                                讲师: {course.instructor}
                              </Text>
                            </Space>
                          </Col>
                          <Col span={12}>
                            <Space size="small">
                              <ClockCircleOutlined style={{ color: '#999' }} />
                              <Text type="secondary" style={{ fontSize: '12px' }}>
                                已学: {Math.round(progress.timeSpent / 60)}h / {Math.round((course.duration || 0) / 60)}h
                              </Text>
                            </Space>
                          </Col>
                          <Col span={12}>
                            <Space size="small">
                              <StarOutlined style={{ color: '#faad14' }} />
                              <Text type="secondary" style={{ fontSize: '12px' }}>
                                评分: {course.rating}
                              </Text>
                            </Space>
                          </Col>
                          <Col span={12}>
                            <Space size="small">
                              <PlayCircleOutlined style={{ color: '#999' }} />
                              <Text type="secondary" style={{ fontSize: '12px' }}>
                                当前: 第{progress.currentLesson}章节
                              </Text>
                            </Space>
                          </Col>
                        </Row>
                      </div>
                    }
                  />
                </List.Item>
              );
            }}
          />
        )}
      </Card>

      {/* 学习建议 */}
      {learningCourses.length > 0 && (
        <Card 
          title={
            <Space>
              <TrophyOutlined />
              学习建议
            </Space>
          }
          style={{ marginTop: '24px' }}
        >
          <Row gutter={[24, 16]}>
            <Col xs={24} md={8}>
              <Card size="small" style={{ textAlign: 'center', height: '120px' }}>
                <FireOutlined style={{ fontSize: '24px', color: '#fa8c16', marginBottom: '8px' }} />
                <div>
                  <Text strong>保持连续性</Text>
                  <div style={{ marginTop: '4px' }}>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      建议每天至少学习30分钟
                    </Text>
                  </div>
                </div>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card size="small" style={{ textAlign: 'center', height: '120px' }}>
                <BookOutlined style={{ fontSize: '24px', color: '#1890ff', marginBottom: '8px' }} />
                <div>
                  <Text strong>专注当前</Text>
                  <div style={{ marginTop: '4px' }}>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      优先完成进度较高的课程
                    </Text>
                  </div>
                </div>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card size="small" style={{ textAlign: 'center', height: '120px' }}>
                <StarOutlined style={{ fontSize: '24px', color: '#52c41a', marginBottom: '8px' }} />
                <div>
                  <Text strong>及时复习</Text>
                  <div style={{ marginTop: '4px' }}>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      定期回顾已学内容
                    </Text>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </Card>
      )}
    </div>
  );
}
