import { Card, Row, Col, List, Avatar, Tag, Button, Space, Typography, Empty, Statistic, Badge, Modal, Tooltip } from 'antd';
import { useState } from 'react';
import { 
  TrophyOutlined, 
  CheckCircleOutlined,
  CalendarOutlined,
  StarOutlined,
  DownloadOutlined,
  EyeOutlined,
  ShareAltOutlined,
  SafetyCertificateOutlined,
  BookOutlined
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { 
  mockCertificates
} from '../data/mockData';

const { Title, Text } = Typography;

export default function CertificatesPage() {
  const { user } = useAuth();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<any>(null);

  // 获取用户的证书
  const userCertificates = mockCertificates.filter(cert => cert.userId === user?.id);
  
  // 扩展证书数据（添加更多示例证书）
  const extendedCertificates = [
    ...userCertificates,
    {
      id: 'cert-2',
      userId: '1',
      courseId: '1',
      courseName: 'React 入门到精通',
      instructorName: '李四',
      issueDate: '2024-01-25',
      verificationCode: 'CERT-RC-002-2024',
      grade: 88,
      isValid: true,
      type: 'completion',
      skills: ['React', 'JavaScript', 'Frontend']
    },
    {
      id: 'cert-3',
      userId: '1',
      courseId: '2',
      courseName: '企业级Node.js开发',
      instructorName: '李四',
      issueDate: '2024-02-10',
      verificationCode: 'CERT-NJ-003-2024',
      grade: 92,
      isValid: true,
      type: 'completion',
      skills: ['Node.js', 'Backend', 'API']
    }
  ];

  // 按类型分组证书
  const completionCertificates = extendedCertificates.filter(cert => cert.type !== 'achievement');

  // 证书预览
  const handlePreview = (certificate: any) => {
    setSelectedCertificate(certificate);
    setPreviewVisible(true);
  };

  // 证书模板
  const CertificateTemplate = ({ certificate }: { certificate: any }) => (
    <div style={{
      width: '600px',
      height: '400px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      border: '8px solid #gold',
      borderRadius: '12px',
      padding: '40px',
      color: 'white',
      position: 'relative',
      textAlign: 'center',
      fontFamily: 'serif'
    }}>
      <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
        学习完成证书
      </div>
      <div style={{ fontSize: '16px', marginBottom: '30px' }}>
        Certificate of Completion
      </div>
      <div style={{ fontSize: '18px', marginBottom: '20px' }}>
        兹证明
      </div>
      <div style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '30px', color: '#ffd700' }}>
        {user?.name}
      </div>
      <div style={{ fontSize: '16px', marginBottom: '20px' }}>
        已成功完成课程
      </div>
      <div style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '30px' }}>
        {certificate.courseName}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
        <div>
          <div style={{ fontSize: '14px' }}>讲师签名</div>
          <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{certificate.instructorName}</div>
        </div>
        <div>
          <div style={{ fontSize: '14px' }}>颁发日期</div>
          <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{certificate.issueDate}</div>
        </div>
      </div>
      <div style={{ 
        position: 'absolute',
        bottom: '10px',
        right: '10px',
        fontSize: '12px',
        opacity: 0.8
      }}>
        验证码: {certificate.verificationCode}
      </div>
    </div>
  );

  return (
    <div style={{ padding: '24px' }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>
          <TrophyOutlined style={{ marginRight: '8px' }} />
          我的证书
        </Title>
        <Text type="secondary">
          查看和管理您获得的学习证书
        </Text>
      </div>

      {/* 证书统计 */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="获得证书"
              value={extendedCertificates.length}
              suffix="张"
              prefix={<TrophyOutlined style={{ color: '#fa8c16' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="完成课程"
              value={completionCertificates.length}
              suffix="门"
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="平均分数"
              value={Math.round(extendedCertificates.reduce((sum, cert) => sum + (cert.grade || 0), 0) / extendedCertificates.length || 0)}
              suffix="分"
              prefix={<StarOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* 证书列表 */}
      <Card 
        title={
          <Space>
            <SafetyCertificateOutlined />
            课程完成证书
          </Space>
        }
      >
        {extendedCertificates.length === 0 ? (
          <Empty 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="您还没有获得任何证书"
          >
            <Button type="primary" onClick={() => window.location.href = '/courses'}>
              开始学习获得证书
            </Button>
          </Empty>
        ) : (
          <List
            grid={{ gutter: 24, xs: 1, sm: 1, md: 2, lg: 2, xl: 3 }}
            dataSource={extendedCertificates}
            renderItem={certificate => (
              <List.Item>
                <Card
                  hoverable
                  style={{ height: '300px' }}
                  cover={
                    <div style={{
                      height: '150px',
                      background: `linear-gradient(135deg, ${
                        (certificate.grade || 0) >= 90 ? '#f093fb 0%, #f5576c 100%' :
                        (certificate.grade || 0) >= 80 ? '#4facfe 0%, #00f2fe 100%' :
                        '#43e97b 0%, #38f9d7 100%'
                      })`,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      color: 'white',
                      position: 'relative'
                    }}>
                      <TrophyOutlined style={{ fontSize: '32px', marginBottom: '8px' }} />
                      <Text style={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>
                        学习完成证书
                      </Text>
                      <Badge 
                        count={certificate.grade} 
                        style={{ 
                          backgroundColor: (certificate.grade || 0) >= 90 ? '#ff4d4f' :
                                          (certificate.grade || 0) >= 80 ? '#1890ff' : '#52c41a',
                          position: 'absolute',
                          top: '10px',
                          right: '10px'
                        }}
                      />
                    </div>
                  }
                  actions={[
                    <Tooltip title="预览证书">
                      <Button 
                        type="text" 
                        icon={<EyeOutlined />}
                        onClick={() => handlePreview(certificate)}
                      />
                    </Tooltip>,
                    <Tooltip title="下载证书">
                      <Button 
                        type="text" 
                        icon={<DownloadOutlined />}
                        onClick={() => console.log('下载证书:', certificate.id)}
                      />
                    </Tooltip>,
                    <Tooltip title="分享证书">
                      <Button 
                        type="text" 
                        icon={<ShareAltOutlined />}
                        onClick={() => console.log('分享证书:', certificate.id)}
                      />
                    </Tooltip>
                  ]}
                >
                  <Card.Meta
                    avatar={
                      <Avatar 
                        icon={<BookOutlined />} 
                        style={{ 
                          backgroundColor: (certificate.grade || 0) >= 90 ? '#ff4d4f' :
                                          (certificate.grade || 0) >= 80 ? '#1890ff' : '#52c41a'
                        }}
                      />
                    }
                    title={
                      <div>
                        <Text strong style={{ fontSize: '14px' }}>
                          {certificate.courseName}
                        </Text>
                        <div style={{ marginTop: '4px' }}>
                          <Tag 
                            color={
                              (certificate.grade || 0) >= 90 ? 'red' :
                              (certificate.grade || 0) >= 80 ? 'blue' : 'green'
                            }
                            style={{ fontSize: '11px' }}
                          >
                            {(certificate.grade || 0) >= 90 ? '优秀' :
                             (certificate.grade || 0) >= 80 ? '良好' : '合格'}
                          </Tag>
                          {certificate.isValid && (
                            <Tag color="green" style={{ fontSize: '11px' }}>有效</Tag>
                          )}
                        </div>
                      </div>
                    }
                    description={
                      <div>
                        <div style={{ marginBottom: '8px' }}>
                          <Space size="small">
                            <CalendarOutlined style={{ color: '#999' }} />
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              {certificate.issueDate}
                            </Text>
                          </Space>
                        </div>
                        <div style={{ marginBottom: '8px' }}>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            讲师: {certificate.instructorName}
                          </Text>
                        </div>
                        <div>
                          <Text type="secondary" style={{ fontSize: '11px' }}>
                            验证码: {certificate.verificationCode}
                          </Text>
                        </div>
                      </div>
                    }
                  />
                </Card>
              </List.Item>
            )}
          />
        )}
      </Card>

      {/* 证书验证说明 */}
      <Card 
        title="证书验证说明"
        style={{ marginTop: '24px' }}
        size="small"
      >
        <Row gutter={[24, 16]}>
          <Col xs={24} md={8}>
            <Space>
              <SafetyCertificateOutlined style={{ color: '#52c41a' }} />
              <div>
                <Text strong>验证真实性</Text>
                <div style={{ marginTop: '4px' }}>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    每张证书都有唯一验证码
                  </Text>
                </div>
              </div>
            </Space>
          </Col>
          <Col xs={24} md={8}>
            <Space>
              <DownloadOutlined style={{ color: '#1890ff' }} />
              <div>
                <Text strong>永久保存</Text>
                <div style={{ marginTop: '4px' }}>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    支持PDF格式下载保存
                  </Text>
                </div>
              </div>
            </Space>
          </Col>
          <Col xs={24} md={8}>
            <Space>
              <ShareAltOutlined style={{ color: '#fa8c16' }} />
              <div>
                <Text strong>社交分享</Text>
                <div style={{ marginTop: '4px' }}>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    分享您的学习成就
                  </Text>
                </div>
              </div>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 证书预览模态框 */}
      <Modal
        title="证书预览"
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={[
          <Button key="download" type="primary" icon={<DownloadOutlined />}>
            下载证书
          </Button>,
          <Button key="share" icon={<ShareAltOutlined />}>
            分享证书
          </Button>
        ]}
        width={700}
      >
        {selectedCertificate && <CertificateTemplate certificate={selectedCertificate} />}
      </Modal>
    </div>
  );
}
