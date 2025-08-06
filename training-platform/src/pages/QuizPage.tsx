import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  Radio, 
  Checkbox, 
  Button, 
  Typography, 
  Progress, 
  Space, 
  Alert, 
  Result,
  Modal,
  Row,
  Col,
  Statistic
} from 'antd';
import { 
  ClockCircleOutlined, 
  CheckCircleOutlined, 
  TrophyOutlined,
  WarningOutlined
} from '@ant-design/icons';
import { mockQuizzes } from '../data/mockData';
import type { QuizSubmission } from '../types';

const { Title, Text, Paragraph } = Typography;

export default function QuizPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(mockQuizzes.find(q => q.id === id));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submission, setSubmission] = useState<QuizSubmission | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    if (quiz && !isSubmitted) {
      setTimeLeft(quiz.timeLimit * 60); // 转换为秒
    }
  }, [quiz, isSubmitted]);

  // 倒计时
  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isSubmitted) {
      handleSubmit(); // 时间到自动提交
    }
  }, [timeLeft, isSubmitted]);

  // 如果没有找到测验，使用默认测验进行测试
  useEffect(() => {
    if (!quiz) {
      const quizId = id || 'quiz-1';
      const defaultQuiz = mockQuizzes.find(q => q.id === quizId);
      
      if (defaultQuiz) {
        // 在测试环境中使用默认测验
        setQuiz(defaultQuiz);
      }
    }
  }, [id, quiz]);
  
  if (!quiz) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Title level={3}>测验未找到</Title>
        <Button type="primary" onClick={() => navigate('/courses')}>
          返回课程
        </Button>
      </div>
    );
  }

  const handleAnswerChange = (value: any) => {
    const question = quiz.questions[currentQuestion];
    setAnswers({
      ...answers,
      [question.id]: value
    });
  };

  const calculateScore = () => {
    let totalScore = 0;
    let maxScore = 0;

    quiz.questions.forEach(question => {
      maxScore += question.points;
      const userAnswer = answers[question.id];
      
      if (question.type === 'single-choice' || question.type === 'true-false') {
        if (userAnswer === question.correctAnswer) {
          totalScore += question.points;
        }
      } else if (question.type === 'multiple-choice') {
        const correctAnswers = Array.isArray(question.correctAnswer) ? question.correctAnswer : [question.correctAnswer];
        const userAnswers = Array.isArray(userAnswer) ? userAnswer : [];
        
        // 计算正确答案的百分比
        const correctCount = userAnswers.filter(answer => correctAnswers.includes(answer)).length;
        const incorrectCount = userAnswers.filter(answer => !correctAnswers.includes(answer)).length;
        
        if (incorrectCount === 0 && correctCount === correctAnswers.length) {
          totalScore += question.points;
        } else if (correctCount > 0 && incorrectCount === 0) {
          totalScore += (question.points * correctCount) / correctAnswers.length;
        }
      }
    });

    return { score: Math.round(totalScore), maxScore };
  };

  const handleSubmit = () => {
    const { score, maxScore } = calculateScore();
    const isPassed = (score / maxScore) * 100 >= quiz.passingScore;
    
    const newSubmission: QuizSubmission = {
      id: 'sub-' + Date.now(),
      userId: 'current-user',
      quizId: quiz.id,
      answers,
      score,
      maxScore,
      isPassed,
      submittedAt: new Date().toISOString(),
      timeSpent: quiz.timeLimit - Math.floor(timeLeft / 60),
      attemptNumber: 1
    };

    setSubmission(newSubmission);
    setIsSubmitted(true);
    setShowConfirmModal(false);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timeLeft <= 300) return '#ff4d4f'; // 红色，5分钟内
    if (timeLeft <= 600) return '#fa8c16'; // 橙色，10分钟内
    return '#52c41a'; // 绿色
  };

  if (isSubmitted && submission) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Result
          status={submission.isPassed ? 'success' : 'warning'}
          title={submission.isPassed ? '恭喜！测验通过' : '很遗憾，测验未通过'}
          subTitle={
            <div>
              <div>您的得分：{submission.score} / {submission.maxScore}</div>
              <div>正确率：{Math.round((submission.score / submission.maxScore) * 100)}%</div>
              <div>通过线：{quiz.passingScore}%</div>
            </div>
          }
          extra={[
            <Button type="primary" key="review" onClick={() => setIsSubmitted(false)}>
              查看详解
            </Button>,
            <Button key="back" onClick={() => navigate('/courses')}>
              返回课程
            </Button>
          ]}
        />

        <Row gutter={16} style={{ marginTop: '24px' }}>
          <Col span={8}>
            <Card>
              <Statistic
                title="用时"
                value={submission.timeSpent}
                suffix="分钟"
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="正确题数"
                value={quiz.questions.filter(q => {
                  const userAnswer = answers[q.id];
                  if (q.type === 'single-choice' || q.type === 'true-false') {
                    return userAnswer === q.correctAnswer;
                  }
                  return false;
                }).length}
                suffix={`/ ${quiz.questions.length}`}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="尝试次数"
                value={submission.attemptNumber}
                suffix={`/ ${quiz.maxAttempts}`}
                prefix={<TrophyOutlined />}
              />
            </Card>
          </Col>
        </Row>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* 测验头部信息 */}
      <Card style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={3} style={{ margin: 0 }}>{quiz.title}</Title>
            <Text type="secondary">{quiz.description}</Text>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: getTimeColor(), fontSize: '24px', fontWeight: 'bold' }}>
              <ClockCircleOutlined style={{ marginRight: '8px' }} />
              {formatTime(timeLeft)}
            </div>
            <Text type="secondary">剩余时间</Text>
          </div>
        </div>
        
        <div style={{ marginTop: '16px' }}>
          <Text strong>进度：</Text>
          <Progress 
            percent={Math.round(progress)} 
            style={{ marginTop: '8px' }}
            strokeColor={timeLeft <= 300 ? '#ff4d4f' : '#1890ff'}
          />
          <Text type="secondary">
            第 {currentQuestion + 1} 题，共 {quiz.questions.length} 题
          </Text>
        </div>
      </Card>

      {/* 当前题目 */}
      <Card>
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Title level={4} style={{ margin: 0, flex: 1 }}>
              题目 {currentQuestion + 1}：{currentQ.question}
            </Title>
            <div style={{ marginLeft: '16px', textAlign: 'right' }}>
              <Text strong>{currentQ.points} 分</Text>
            </div>
          </div>
        </div>

        {/* 答题区域 */}
        <div style={{ marginBottom: '32px' }}>
          {currentQ.type === 'single-choice' && (
            <Radio.Group
              value={answers[currentQ.id]}
              onChange={(e) => handleAnswerChange(e.target.value)}
              style={{ width: '100%' }}
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                {currentQ.options?.map((option, index) => (
                  <Radio key={index} value={option} style={{ padding: '8px 0' }}>
                    {option}
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
          )}

          {currentQ.type === 'multiple-choice' && (
            <Checkbox.Group
              value={answers[currentQ.id] || []}
              onChange={handleAnswerChange}
              style={{ width: '100%' }}
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                {currentQ.options?.map((option, index) => (
                  <Checkbox key={index} value={option} style={{ padding: '8px 0' }}>
                    {option}
                  </Checkbox>
                ))}
              </Space>
            </Checkbox.Group>
          )}

          {currentQ.type === 'true-false' && (
            <Radio.Group
              value={answers[currentQ.id]}
              onChange={(e) => handleAnswerChange(e.target.value)}
            >
              <Space size="large">
                <Radio value="true">正确</Radio>
                <Radio value="false">错误</Radio>
              </Space>
            </Radio.Group>
          )}
        </div>

        {/* 导航按钮 */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            disabled={currentQuestion === 0}
            onClick={() => setCurrentQuestion(currentQuestion - 1)}
          >
            上一题
          </Button>
          
          <Space>
            {currentQuestion < quiz.questions.length - 1 ? (
              <Button
                type="primary"
                onClick={() => setCurrentQuestion(currentQuestion + 1)}
              >
                下一题
              </Button>
            ) : (
              <Button
                type="primary"
                danger
                icon={<WarningOutlined />}
                onClick={() => setShowConfirmModal(true)}
              >
                提交答案
              </Button>
            )}
          </Space>
        </div>

        {/* 答题提示 */}
        {timeLeft <= 300 && (
          <Alert
            message="注意：时间不足5分钟！"
            description="请抓紧时间完成剩余题目"
            type="warning"
            showIcon
            style={{ marginTop: '16px' }}
          />
        )}
      </Card>

      {/* 提交确认对话框 */}
      <Modal
        title="确认提交答案"
        open={showConfirmModal}
        onOk={handleSubmit}
        onCancel={() => setShowConfirmModal(false)}
        okText="确认提交"
        cancelText="继续答题"
        okButtonProps={{ danger: true }}
      >
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <WarningOutlined style={{ fontSize: '48px', color: '#fa8c16', marginBottom: '16px' }} />
          <Title level={4}>确认要提交答案吗？</Title>
          <Paragraph>
            提交后将无法修改答案。您已完成 {Object.keys(answers).length} / {quiz.questions.length} 题。
          </Paragraph>
          <Alert
            message={`通过标准：${quiz.passingScore}%`}
            type="info"
            showIcon
          />
        </div>
      </Modal>
    </div>
  );
}
