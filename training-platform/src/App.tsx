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
import LearningProgressPage from './pages/LearningProgressPage';
import MyCoursesPage from './pages/MyCoursesPage';
import LearningPage from './pages/LearningPage';
import CertificatesPage from './pages/CertificatesPage';
import AchievementsPage from './pages/AchievementsPage';
import NotificationsPage from './pages/NotificationsPage';
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
        <Route path="/dashboard/notifications" element={<NotificationsPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:id" element={<CourseDetailPage />} />
        <Route path="/quiz/:id" element={<QuizPage />} />
        <Route path="/courses/all" element={<CoursesPage />} />
        <Route path="/courses/my" element={<MyCoursesPage />} />
        <Route path="/courses/learning" element={<LearningPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/info" element={<ProfilePage />} />
        <Route path="/profile/progress" element={<LearningProgressPage />} />
        <Route path="/profile/certificates" element={<CertificatesPage />} />
        <Route path="/achievements" element={<AchievementsPage />} />
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
