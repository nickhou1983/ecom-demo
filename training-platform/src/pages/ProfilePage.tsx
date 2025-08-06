import { Card, Row, Col, Avatar, Typography, Descriptions, Progress, List, Tag, Statistic } from 'antd';
import { UserOutlined, TrophyOutlined, BookOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { mockProgress, mockCourses, mockCertificates } from '../data/mockData';

const { Title, Text } = Typography;

export default function ProfilePage() {
  const { user } = useAuth();
  
  if (!user) return null;

  // 计算学习统计
  const userProgress = mockProgress.filter(p => p.userId === user.id);
  const completedCourses = userProgress.filter(p => p.completedDate).length;
  const inProgressCourses = userProgress.filter(p => !p.completedDate).length;
  const totalLearningTime = userProgress.reduce((total, p) => total + p.timeSpent, 0);
  const userCertificates = mockCertificates.filter(c => c.userId === user.id);

  // 获取用户学习的课程详情
  const learningCourses = userProgress.map(progress => {
    const course = mockCourses.find(c => c.id === progress.courseId);
    return {
      ...progress,
      course
    };
  }).filter(item => item.course);

  return (
    <div>
      <Title level={2}>个人中心</Title>
      
      <Row gutter={[24, 24]}>
        {/* 用户信息卡片 */}
        <Col xs={24} lg={8}>
          <Card>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <Avatar size={80} src={user.avatar} icon={<UserOutlined />} />
              <Title level={3} style={{ marginTop: '16px', marginBottom: '8px' }}>
                {user.name}
              </Title>
              <Tag color="blue">
                {user.role === 'student' ? '学员' : user.role === 'instructor' ? '讲师' : '管理员'}
              </Tag>
            </div>
            
            <Descriptions column={1} size="small">
              <Descriptions.Item label="邮箱">{user.email}</Descriptions.Item>
              <Descriptions.Item label="部门">{user.department}</Descriptions.Item>
              <Descriptions.Item label="电话">{user.phone}</Descriptions.Item>
              <Descriptions.Item label="加入时间">
                {new Date(user.joinDate).toLocaleDateString('zh-CN')}
              </Descriptions.Item>
            </Descriptions>
            
            {user.bio && (
              <div style={{ marginTop: '16px' }}>
                <Text strong>个人简介：</Text>
                <div style={{ marginTop: '8px' }}>
                  <Text type="secondary">{user.bio}</Text>
                </div>
              </div>
            )}
            
            {user.skills && user.skills.length > 0 && (
              <div style={{ marginTop: '16px' }}>
                <Text strong>技能标签：</Text>
                <div style={{ marginTop: '8px' }}>
                  {user.skills.map(skill => (
                    <Tag key={skill} color="blue" style={{ marginBottom: '4px' }}>
                      {skill}
                    </Tag>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </Col>

        {/* 学习统计 */}
        <Col xs={24} lg={16}>
          <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col xs={12} md={6}>
              <Card>
                <Statistic
                  title="已完成课程"
                  value={completedCourses}
                  prefix={<BookOutlined style={{ color: '#52c41a' }} />}
                  suffix="门"
                />
              </Card>
            </Col>
            <Col xs={12} md={6}>
              <Card>
                <Statistic
                  title="进行中课程"
                  value={inProgressCourses}
                  prefix={<BookOutlined style={{ color: '#1890ff' }} />}
                  suffix="门"
                />
              </Card>
            </Col>
            <Col xs={12} md={6}>
              <Card>
                <Statistic
                  title="学习时长"
                  value={Math.round(totalLearningTime / 60)}
                  prefix={<ClockCircleOutlined style={{ color: '#fa8c16' }} />}
                  suffix="小时"
                />
              </Card>
            </Col>
            <Col xs={12} md={6}>
              <Card>
                <Statistic
                  title="获得证书"
                  value={userCertificates.length}
                  prefix={<TrophyOutlined style={{ color: '#eb2f96' }} />}
                  suffix="张"
                />
              </Card>
            </Col>
          </Row>

          {/* 学习进度 */}
          <Card title="我的学习进度" style={{ marginBottom: '24px' }}>
            <List
              dataSource={learningCourses}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        shape="square" 
                        size={48} 
                        src={item.course?.thumbnail}
                        icon={<BookOutlined />}
                      />
                    }
                    title={
                      <div>
                        <div>{item.course?.title}</div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {item.course?.instructor} • {item.course?.category}
                        </Text>
                      </div>
                    }
                    description={
                      <div>
                        <Progress percent={item.completedPercentage} size="small" style={{ marginBottom: '4px' }} />
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          最后学习时间：{new Date(item.lastAccessed).toLocaleDateString('zh-CN')}
                        </Text>
                      </div>
                    }
                  />
                  <div>
                    {item.completedDate ? (
                      <Tag color="green">已完成</Tag>
                    ) : (
                      <Tag color="blue">学习中</Tag>
                    )}
                  </div>
                </List.Item>
              )}
            />
          </Card>

          {/* 获得的证书 */}
          {userCertificates.length > 0 && (
            <Card title="我的证书">
              <List
                dataSource={userCertificates}
                renderItem={(certificate) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<TrophyOutlined style={{ fontSize: '24px', color: '#fa8c16' }} />}
                      title={certificate.courseName}
                      description={
                        <div>
                          <div>颁发日期：{certificate.issueDate}</div>
                          <div>验证码：<Text code>{certificate.verificationCode}</Text></div>
                          {certificate.grade && (
                            <div>成绩：<Text strong>{certificate.grade}分</Text></div>
                          )}
                        </div>
                      }
                    />
                    <div>
                      <Tag color={certificate.isValid ? 'green' : 'red'}>
                        {certificate.isValid ? '有效' : '已失效'}
                      </Tag>
                    </div>
                  </List.Item>
                )}
              />
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
}
