import { Card, Row, Col, List, Avatar, Tag, Space, Typography, Progress, Badge, Statistic, Timeline, Tooltip } from 'antd';
import { 
  TrophyOutlined, 
  CrownOutlined,
  FireOutlined,
  StarOutlined,
  BookOutlined,
  CheckCircleOutlined,
  ThunderboltOutlined,
  HeartOutlined,
  RocketOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { 
  mockLearningActivities
} from '../data/mockData';

const { Title, Text } = Typography;

export default function AchievementsPage() {
  const { user } = useAuth();
  const activities = mockLearningActivities.filter(a => a.userId === user?.id);

  // 定义成就类型
  type RarityType = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

  interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    progress: number;
    unlocked: boolean;
    unlockedDate?: string;
    points: number;
    rarity: RarityType;
  }

  // 定义成就数据
  const achievements: Achievement[] = [
    {
      id: 'first-course',
      title: '初学者',
      description: '完成第一门课程',
      icon: <BookOutlined />,
      color: '#52c41a',
      progress: 100,
      unlocked: true,
      unlockedDate: '2024-01-18',
      points: 100,
      rarity: 'common'
    },
    {
      id: 'study-streak-7',
      title: '学习达人',
      description: '连续学习7天',
      icon: <FireOutlined />,
      color: '#fa8c16',
      progress: 100,
      unlocked: true,
      unlockedDate: '2024-01-22',
      points: 200,
      rarity: 'uncommon'
    },
    {
      id: 'perfect-score',
      title: '完美主义者',
      description: '测验获得满分',
      icon: <StarOutlined />,
      color: '#faad14',
      progress: 100,
      unlocked: true,
      unlockedDate: '2024-01-18',
      points: 300,
      rarity: 'rare'
    },
    {
      id: 'early-bird',
      title: '早起鸟',
      description: '在早上6-8点之间学习',
      icon: <RocketOutlined />,
      color: '#1890ff',
      progress: 75,
      unlocked: false,
      points: 150,
      rarity: 'uncommon'
    },
    {
      id: 'night-owl',
      title: '夜猫子',
      description: '在晚上10点后学习',
      icon: <ThunderboltOutlined />,
      color: '#722ed1',
      progress: 50,
      unlocked: false,
      points: 150,
      rarity: 'uncommon'
    },
    {
      id: 'speed-learner',
      title: '速度学习者',
      description: '单日学习超过4小时',
      icon: <ThunderboltOutlined />,
      color: '#eb2f96',
      progress: 30,
      unlocked: false,
      points: 400,
      rarity: 'epic'
    },
    {
      id: 'master-learner',
      title: '学习大师',
      description: '完成10门课程',
      icon: <CrownOutlined />,
      color: '#fa541c',
      progress: 10,
      unlocked: false,
      points: 1000,
      rarity: 'legendary'
    },
    {
      id: 'dedicated-learner',
      title: '专注学习者',
      description: '连续学习30天',
      icon: <HeartOutlined />,
      color: '#f759ab',
      progress: 16,
      unlocked: false,
      points: 500,
      rarity: 'epic'
    }
  ];

  // 按稀有度分组
  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);

  // 稀有度配置
  const rarityConfig: Record<RarityType, { color: string; label: string }> = {
    common: { color: '#52c41a', label: '普通' },
    uncommon: { color: '#1890ff', label: '少见' },
    rare: { color: '#faad14', label: '稀有' },
    epic: { color: '#eb2f96', label: '史诗' },
    legendary: { color: '#fa541c', label: '传说' }
  };

  // 计算总积分
  const totalPoints = unlockedAchievements.reduce((sum, achievement) => sum + achievement.points, 0);

  // 最近解锁的成就
  const recentAchievements = unlockedAchievements
    .sort((a, b) => new Date(b.unlockedDate!).getTime() - new Date(a.unlockedDate!).getTime())
    .slice(0, 3);

  return (
    <div style={{ padding: '24px' }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>
          <TrophyOutlined style={{ marginRight: '8px' }} />
          成就中心
        </Title>
        <Text type="secondary">
          展示您的学习成就，激励持续进步
        </Text>
      </div>

      {/* 成就统计 */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="已解锁成就"
              value={unlockedAchievements.length}
              suffix={`/ ${achievements.length}`}
              prefix={<TrophyOutlined style={{ color: '#fa8c16' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="成就积分"
              value={totalPoints}
              prefix={<StarOutlined style={{ color: '#faad14' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="完成度"
              value={Math.round((unlockedAchievements.length / achievements.length) * 100)}
              suffix="%"
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="当前等级"
              value={Math.floor(totalPoints / 500) + 1}
              prefix={<CrownOutlined style={{ color: '#eb2f96' }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* 最近解锁的成就 */}
      {recentAchievements.length > 0 && (
        <Card 
          title={
            <Space>
              <StarOutlined />
              最近解锁
            </Space>
          }
          style={{ marginBottom: '24px' }}
        >
          <Row gutter={[16, 16]}>
            {recentAchievements.map(achievement => (
              <Col xs={24} sm={8} key={achievement.id}>
                <Card
                  size="small"
                  style={{ 
                    textAlign: 'center',
                    background: `linear-gradient(135deg, ${achievement.color}20 0%, ${achievement.color}10 100%)`,
                    border: `2px solid ${achievement.color}`,
                  }}
                >
                  <Avatar 
                    size={48} 
                    icon={achievement.icon}
                    style={{ 
                      backgroundColor: achievement.color,
                      marginBottom: '8px'
                    }}
                  />
                  <div>
                    <Text strong>{achievement.title}</Text>
                    <div style={{ marginTop: '4px' }}>
                      <Tag color={rarityConfig[achievement.rarity].color} style={{ fontSize: '11px' }}>
                        {rarityConfig[achievement.rarity].label}
                      </Tag>
                    </div>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {achievement.unlockedDate}
                    </Text>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      )}

      <Row gutter={[24, 24]}>
        {/* 已解锁成就 */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <TrophyOutlined />
                已解锁成就 ({unlockedAchievements.length})
              </Space>
            }
            style={{ height: '600px' }}
          >
            <div style={{ height: 'calc(100% - 50px)', overflowY: 'auto' }}>
              <List
                dataSource={unlockedAchievements}
                renderItem={achievement => (
                  <List.Item style={{ padding: '12px 0' }}>
                    <List.Item.Meta
                      avatar={
                        <Badge count={achievement.points} style={{ backgroundColor: achievement.color }}>
                          <Avatar 
                            size={48} 
                            icon={achievement.icon}
                            style={{ 
                              backgroundColor: achievement.color,
                              border: `2px solid ${achievement.color}20`
                            }}
                          />
                        </Badge>
                      }
                      title={
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Text strong>{achievement.title}</Text>
                          <Space>
                            <Tag color={rarityConfig[achievement.rarity].color} style={{ fontSize: '11px' }}>
                              {rarityConfig[achievement.rarity].label}
                            </Tag>
                            <CheckCircleOutlined style={{ color: '#52c41a' }} />
                          </Space>
                        </div>
                      }
                      description={
                        <div>
                          <Text type="secondary" style={{ marginBottom: '4px', display: 'block' }}>
                            {achievement.description}
                          </Text>
                          <Space>
                            <CalendarOutlined style={{ color: '#999' }} />
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              解锁于 {achievement.unlockedDate}
                            </Text>
                          </Space>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </div>
          </Card>
        </Col>

        {/* 待解锁成就 */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <RocketOutlined />
                待解锁成就 ({lockedAchievements.length})
              </Space>
            }
            style={{ height: '600px' }}
          >
            <div style={{ height: 'calc(100% - 50px)', overflowY: 'auto' }}>
              <List
                dataSource={lockedAchievements}
                renderItem={achievement => (
                  <List.Item style={{ padding: '12px 0', opacity: 0.7 }}>
                    <List.Item.Meta
                      avatar={
                        <Tooltip title={`还需 ${achievement.points} 积分`}>
                          <Avatar 
                            size={48} 
                            icon={achievement.icon}
                            style={{ 
                              backgroundColor: '#d9d9d9',
                              border: '2px solid #f0f0f0'
                            }}
                          />
                        </Tooltip>
                      }
                      title={
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Text>{achievement.title}</Text>
                          <Space>
                            <Tag style={{ fontSize: '11px' }}>
                              {rarityConfig[achievement.rarity].label}
                            </Tag>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              {achievement.progress}%
                            </Text>
                          </Space>
                        </div>
                      }
                      description={
                        <div>
                          <Text type="secondary" style={{ marginBottom: '8px', display: 'block' }}>
                            {achievement.description}
                          </Text>
                          <Progress 
                            percent={achievement.progress} 
                            size="small"
                            strokeColor={achievement.color}
                            showInfo={false}
                          />
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

      {/* 学习历程时间线 */}
      <Card 
        title={
          <Space>
            <CalendarOutlined />
            学习历程
          </Space>
        }
        style={{ marginTop: '24px' }}
      >
        <Timeline
          items={[
            ...recentAchievements.map(achievement => ({
              color: achievement.color,
              children: (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                    <TrophyOutlined style={{ marginRight: '8px', color: achievement.color }} />
                    <Text strong>解锁成就: {achievement.title}</Text>
                  </div>
                  <Text type="secondary">{achievement.description}</Text>
                  <div style={{ marginTop: '4px' }}>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {achievement.unlockedDate}
                    </Text>
                  </div>
                </div>
              )
            })),
            ...activities.slice(0, 3).map(activity => ({
              color: '#1890ff',
              children: (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                    <BookOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                    <Text strong>{activity.title}</Text>
                  </div>
                  <Text type="secondary">{activity.description}</Text>
                  <div style={{ marginTop: '4px' }}>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {new Date(activity.timestamp).toLocaleString('zh-CN')}
                    </Text>
                  </div>
                </div>
              )
            }))
          ]}
        />
      </Card>
    </div>
  );
}
