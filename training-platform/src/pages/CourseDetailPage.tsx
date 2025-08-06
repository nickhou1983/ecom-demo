import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Tag, 
  Progress, 
  Avatar, 
  List, 
  Typography, 
  Space, 
  Divider,
  Collapse,
  Modal,
  Rate,
  Breadcrumb
} from 'antd';
import { 
  PlayCircleOutlined, 
  BookOutlined, 
  ClockCircleOutlined,
  UserOutlined,
  DownloadOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined,
  LockOutlined
} from '@ant-design/icons';
import { mockCourses, mockProgress } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [enrollModal, setEnrollModal] = useState(false);
  
  const course = mockCourses.find(c => c.id === id);
  const userProgress = mockProgress.find(p => p.courseId === id && p.userId === user?.id);
  
  if (!course) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Title level={3}>课程未找到</Title>
        <Button type="primary" onClick={() => navigate('/courses')}>
          返回课程列表
        </Button>
      </div>
    );
  }

  const isEnrolled = !!userProgress;
  const completedLessons = userProgress?.completedLessons || [];
  const currentLesson = userProgress?.currentLesson;

  const handleEnroll = () => {
    setEnrollModal(false);
    // 这里应该调用API来注册课程
    console.log('注册课程:', course.id);
    // 简单的模拟：导航到学习页面
    navigate(`/learn/${course.id}`);
  };

  const handleStartLearning = () => {
    if (isEnrolled) {
      navigate(`/learn/${course.id}/${currentLesson || course.lessons[0]?.id}`);
    } else {
      setEnrollModal(true);
    }
  };

  const getLevelText = (level: string) => {
    const levelMap = {
      'beginner': '初级',
      'intermediate': '中级', 
      'advanced': '高级'
    };
    return levelMap[level as keyof typeof levelMap] || level;
  };

  const getLevelColor = (level: string) => {
    const colorMap = {
      'beginner': 'green',
      'intermediate': 'orange',
      'advanced': 'red'
    };
    return colorMap[level as keyof typeof colorMap] || 'default';
  };

  return (
    <div>
      {/* 面包屑导航 */}
      <Breadcrumb style={{ marginBottom: '24px' }}>
        <Breadcrumb.Item>
          <Button 
            type="link" 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/courses')}
          >
            课程中心
          </Button>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{course.category}</Breadcrumb.Item>
        <Breadcrumb.Item>{course.title}</Breadcrumb.Item>
      </Breadcrumb>

      <Row gutter={[24, 24]}>
        {/* 左侧主要内容 */}
        <Col xs={24} lg={16}>
          {/* 课程基本信息 */}
          <Card
            cover={
              <div style={{ position: 'relative' }}>
                <img
                  alt={course.title}
                  src={course.thumbnail}
                  style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: 'rgba(0,0,0,0.7)',
                  borderRadius: '50%',
                  width: '80px',
                  height: '80px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}>
                  <PlayCircleOutlined style={{ fontSize: '40px', color: 'white' }} />
                </div>
              </div>
            }
          >
            <div style={{ marginBottom: '16px' }}>
              <Space wrap>
                <Tag color={getLevelColor(course.level)}>
                  {getLevelText(course.level)}
                </Tag>
                <Tag>{course.category}</Tag>
                {course.tags.map(tag => (
                  <Tag key={tag} color="blue">{tag}</Tag>
                ))}
              </Space>
            </div>
            
            <Title level={2} style={{ marginBottom: '16px' }}>
              {course.title}
            </Title>
            
            <Space size="large" style={{ marginBottom: '16px' }}>
              <Space>
                <Avatar icon={<UserOutlined />} />
                <Text strong>{course.instructor}</Text>
              </Space>
              <Space>
                <ClockCircleOutlined />
                <Text>{Math.round(course.duration / 60)}小时</Text>
              </Space>
              <Space>
                <BookOutlined />
                <Text>{course.lessons.length}个章节</Text>
              </Space>
              <Rate disabled defaultValue={course.rating} />
            </Space>
            
            {isEnrolled && userProgress && (
              <div style={{ marginBottom: '16px' }}>
                <Text strong>学习进度:</Text>
                <Progress 
                  percent={userProgress.completedPercentage} 
                  style={{ marginTop: '8px' }}
                />
                <Text type="secondary">
                  已完成 {completedLessons.length} / {course.lessons.length} 章节
                </Text>
              </div>
            )}
            
            <Paragraph>{course.description}</Paragraph>
            
            <Space size="large">
              <Button 
                type="primary" 
                size="large"
                icon={<PlayCircleOutlined />}
                onClick={handleStartLearning}
              >
                {isEnrolled ? '继续学习' : '开始学习'}
              </Button>
              <Text type="secondary">{course.enrolledCount} 人已学习</Text>
            </Space>
          </Card>

          {/* 课程大纲 */}
          <Card title="课程大纲" style={{ marginTop: '24px' }}>
            <Collapse ghost>
              {course.lessons.map((lesson, index) => {
                const isCompleted = completedLessons.includes(lesson.id);
                const isCurrent = currentLesson === lesson.id;
                const isLocked = !isEnrolled && index > 0;
                
                return (
                  <Panel
                    key={lesson.id}
                    header={
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Space>
                          {isCompleted ? (
                            <CheckCircleOutlined style={{ color: '#52c41a' }} />
                          ) : isLocked ? (
                            <LockOutlined style={{ color: '#d9d9d9' }} />
                          ) : (
                            <PlayCircleOutlined style={{ color: isCurrent ? '#1890ff' : '#d9d9d9' }} />
                          )}
                          <span style={{ fontWeight: isCurrent ? 'bold' : 'normal' }}>
                            第{index + 1}章：{lesson.title}
                          </span>
                        </Space>
                        <Space>
                          <Tag>{lesson.type === 'video' ? '视频' : lesson.type === 'quiz' ? '测验' : '文档'}</Tag>
                          <Text type="secondary">{lesson.duration}分钟</Text>
                        </Space>
                      </div>
                    }
                  >
                    <div style={{ paddingLeft: '24px' }}>
                      <Paragraph>{lesson.description}</Paragraph>
                      {lesson.resources && lesson.resources.length > 0 && (
                        <div>
                          <Text strong>课程资源:</Text>
                          <List
                            size="small"
                            dataSource={lesson.resources}
                            renderItem={resource => (
                              <List.Item
                                actions={[
                                  <Button 
                                    size="small" 
                                    icon={<DownloadOutlined />}
                                    disabled={!isEnrolled}
                                  >
                                    下载
                                  </Button>
                                ]}
                              >
                                <List.Item.Meta
                                  title={resource.name}
                                  description={`${resource.type.toUpperCase()} • ${(resource.size / 1024).toFixed(1)} KB`}
                                />
                              </List.Item>
                            )}
                          />
                        </div>
                      )}
                      {lesson.type === 'quiz' && isEnrolled && (
                        <div style={{ marginTop: '16px' }}>
                          <Button
                            type="primary"
                            icon={<PlayCircleOutlined />}
                            onClick={() => navigate(`/quiz/quiz-${lesson.id.split('-')[1]}`)}
                            size="small"
                          >
                            开始测验
                          </Button>
                        </div>
                      )}
                    </div>
                  </Panel>
                );
              })}
            </Collapse>
          </Card>
        </Col>

        {/* 右侧边栏 */}
        <Col xs={24} lg={8}>
          {/* 课程信息卡片 */}
          <Card title="课程信息">
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <div>
                <Text strong>讲师：</Text>
                <div style={{ marginTop: '8px' }}>
                  <Space>
                    <Avatar icon={<UserOutlined />} />
                    <div>
                      <div>{course.instructor}</div>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        高级讲师
                      </Text>
                    </div>
                  </Space>
                </div>
              </div>
              
              <Divider />
              
              <div>
                <Text strong>课程统计</Text>
                <div style={{ marginTop: '8px' }}>
                  <Row gutter={[8, 8]}>
                    <Col span={12}>
                      <Text type="secondary">学习人数</Text>
                      <div>{course.enrolledCount}</div>
                    </Col>
                    <Col span={12}>
                      <Text type="secondary">课程评分</Text>
                      <div>
                        <Rate disabled value={course.rating} style={{ fontSize: '14px' }} />
                      </div>
                    </Col>
                    <Col span={12}>
                      <Text type="secondary">总时长</Text>
                      <div>{Math.round(course.duration / 60)}小时</div>
                    </Col>
                    <Col span={12}>
                      <Text type="secondary">章节数</Text>
                      <div>{course.lessons.length}个</div>
                    </Col>
                  </Row>
                </div>
              </div>
              
              {course.prerequisites && course.prerequisites.length > 0 && (
                <>
                  <Divider />
                  <div>
                    <Text strong>先修要求</Text>
                    <div style={{ marginTop: '8px' }}>
                      {course.prerequisites.map(prereq => (
                        <Tag key={prereq} style={{ marginBottom: '4px' }}>
                          {prereq}
                        </Tag>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </Space>
          </Card>
          
          {/* 课程测验卡片 */}
          {isEnrolled && (
            <Card title="课程测验" style={{ marginTop: '24px' }}>
              <div>
                <Text>通过测验检验您的学习成果，获得课程证书</Text>
                <div style={{ marginTop: '16px' }}>
                  <Button
                    type="primary"
                    icon={<BookOutlined />}
                    onClick={() => navigate(`/quiz/${course.id === '1' ? 'quiz-1' : 'quiz-2'}`)}
                    block
                  >
                    进入测验
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </Col>
      </Row>

      {/* 报名确认对话框 */}
      <Modal
        title="确认报名"
        open={enrollModal}
        onOk={handleEnroll}
        onCancel={() => setEnrollModal(false)}
        okText="确认报名"
        cancelText="取消"
      >
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <BookOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
          <Title level={4}>确认报名学习这门课程？</Title>
          <Paragraph>
            您将开始学习《{course.title}》，预计需要 {Math.round(course.duration / 60)} 小时完成。
          </Paragraph>
        </div>
      </Modal>
    </div>
  );
}
