// 用户相关类型
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'student' | 'instructor' | 'admin';
  joinDate: string;
  department?: string;
  phone?: string;
  bio?: string;
  skills?: string[];
  completedCourses: number;
  totalLearningTime: number; // 以分钟为单位
}

// 课程相关类型
export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorId: string;
  duration: number; // 以分钟为单位
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  tags: string[];
  thumbnail: string;
  rating: number;
  enrolledCount: number;
  lessons: Lesson[];
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
  price?: number;
  prerequisites?: string[];
}

// 课程章节
export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: number; // 以分钟为单位
  type: 'video' | 'document' | 'quiz' | 'assignment';
  content: string; // 视频URL或文档内容
  order: number;
  isCompleted?: boolean;
  resources?: Resource[];
}

// 资源文件
export interface Resource {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'ppt' | 'video' | 'audio' | 'image';
  url: string;
  size: number; // 文件大小（字节）
}

// 学习进度
export interface Progress {
  id: string;
  userId: string;
  courseId: string;
  completedLessons: string[];
  currentLesson: string;
  completedPercentage: number;
  timeSpent: number; // 以分钟为单位
  lastAccessed: string;
  startDate: string;
  completedDate?: string;
  certificates?: Certificate[];
}

// 证书
export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  courseName: string;
  instructorName: string;
  issueDate: string;
  verificationCode: string;
  grade?: number;
  isValid: boolean;
}

// 测验/考试
export interface Quiz {
  id: string;
  title: string;
  description: string;
  courseId: string;
  lessonId?: string;
  questions: Question[];
  timeLimit: number; // 以分钟为单位
  passingScore: number;
  maxAttempts: number;
  isRandomized: boolean;
  createdAt: string;
}

// 问题
export interface Question {
  id: string;
  type: 'multiple-choice' | 'single-choice' | 'true-false' | 'fill-blank' | 'essay';
  question: string;
  options?: string[]; // 选择题选项
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
  order: number;
}

// 测验提交
export interface QuizSubmission {
  id: string;
  userId: string;
  quizId: string;
  answers: Record<string, string | string[]>;
  score: number;
  maxScore: number;
  isPassed: boolean;
  submittedAt: string;
  timeSpent: number; // 以分钟为单位
  attemptNumber: number;
}

// 通知
export interface Notification {
  id: string;
  userId: string;
  title: string;
  content: string;
  type: 'course' | 'assignment' | 'certificate' | 'system';
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

// 学习统计
export interface LearningStats {
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  totalLearningTime: number;
  certificatesEarned: number;
  averageScore: number;
  streak: number; // 连续学习天数
  monthlyProgress: MonthlyProgress[];
}

export interface MonthlyProgress {
  month: string;
  coursesCompleted: number;
  timeSpent: number;
  certificatesEarned: number;
}

// API响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
  code: number;
}

// 分页类型
export interface PaginationParams {
  current: number;
  pageSize: number;
  total?: number;
}

// 筛选参数
export interface CourseFilters {
  category?: string;
  level?: string;
  instructor?: string;
  duration?: [number, number];
  rating?: number;
  tags?: string[];
  search?: string;
}

// 主题配置
export interface ThemeConfig {
  colorPrimary: string;
  colorSuccess: string;
  colorWarning: string;
  colorError: string;
  borderRadius: number;
}

// 应用配置
export interface AppConfig {
  title: string;
  logo: string;
  defaultTheme: 'light' | 'dark';
  language: 'zh-CN' | 'en-US';
  timezone: string;
}
