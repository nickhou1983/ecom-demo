import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppLayout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import ProfilePage from './pages/ProfilePage';
import QuizPage from './pages/QuizPage';
import './App.css';

// 主应用内容
function AppContent() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:id" element={<CourseDetailPage />} />
        <Route path="/quiz/:id" element={<QuizPage />} />
        <Route path="/courses/all" element={<CoursesPage />} />
        <Route path="/courses/my" element={<div>我的课程</div>} />
        <Route path="/courses/learning" element={<div>正在学习</div>} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/info" element={<ProfilePage />} />
        <Route path="/profile/progress" element={<div>学习进度</div>} />
        <Route path="/profile/certificates" element={<div>我的证书</div>} />
        <Route path="/achievements" element={<div>成就中心</div>} />
        <Route path="/admin/*" element={<div>管理后台</div>} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AppLayout>
  );
}

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;
