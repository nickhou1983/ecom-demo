import type { User, Course, Progress, Quiz, Certificate, Notification } from '../types';

// 示例用户数据
export const mockUsers: User[] = [
  {
    id: '1',
    name: '张三',
    email: 'zhangsan@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan',
    role: 'student',
    joinDate: '2024-01-15',
    department: '技术部',
    phone: '13800138000',
    bio: '热爱学习新技术，专注于前端开发',
    skills: ['React', 'JavaScript', 'TypeScript'],
    completedCourses: 5,
    totalLearningTime: 2400, // 40小时
  },
  {
    id: '2',
    name: '李四',
    email: 'lisi@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisi',
    role: 'instructor',
    joinDate: '2023-06-01',
    department: '培训部',
    phone: '13800138001',
    bio: '资深技术专家，10年开发经验',
    skills: ['React', 'Node.js', 'Python', 'DevOps'],
    completedCourses: 15,
    totalLearningTime: 7200, // 120小时
  },
  {
    id: '3',
    name: '王五',
    email: 'wangwu@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wangwu',
    role: 'admin',
    joinDate: '2023-01-01',
    department: '人力资源部',
    phone: '13800138002',
    bio: '负责企业培训体系建设',
    skills: ['管理', '培训设计', '数据分析'],
    completedCourses: 8,
    totalLearningTime: 3600, // 60小时
  }
];

// 示例课程数据
export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'React 入门到精通',
    description: '从零开始学习React框架，掌握现代前端开发技能。包括组件、状态管理、路由、性能优化等核心概念。',
    instructor: '李四',
    instructorId: '2',
    duration: 1200, // 20小时
    level: 'beginner',
    category: '前端开发',
    tags: ['React', 'JavaScript', '前端框架'],
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
    rating: 4.8,
    enrolledCount: 156,
    lessons: [
      {
        id: '1-1',
        title: 'React 基础概念',
        description: '了解React的核心思想和基本概念',
        duration: 60,
        type: 'video',
        content: 'https://example.com/video1',
        order: 1,
        resources: [
          {
            id: 'r1',
            name: 'React官方文档',
            type: 'pdf',
            url: 'https://example.com/react-docs.pdf',
            size: 1024000
          }
        ]
      },
      {
        id: '1-2',
        title: '组件与JSX',
        description: '学习如何创建和使用React组件',
        duration: 90,
        type: 'video',
        content: 'https://example.com/video2',
        order: 2
      },
      {
        id: '1-3',
        title: '状态管理',
        description: '掌握useState和useEffect等Hook',
        duration: 120,
        type: 'video',
        content: 'https://example.com/video3',
        order: 3
      },
      {
        id: '1-4',
        title: '基础测验',
        description: '测试React基础知识掌握情况',
        duration: 30,
        type: 'quiz',
        content: 'quiz-1',
        order: 4
      }
    ],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15',
    isPublished: true,
    prerequisites: ['HTML', 'CSS', 'JavaScript基础']
  },
  {
    id: '2',
    title: '企业级Node.js开发',
    description: '学习使用Node.js构建高性能的后端应用，包括API设计、数据库操作、安全性等。',
    instructor: '李四',
    instructorId: '2',
    duration: 1800, // 30小时
    level: 'intermediate',
    category: '后端开发',
    tags: ['Node.js', 'Express', 'MongoDB', 'API'],
    thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400',
    rating: 4.6,
    enrolledCount: 89,
    lessons: [
      {
        id: '2-1',
        title: 'Node.js环境搭建',
        description: '安装和配置Node.js开发环境',
        duration: 45,
        type: 'video',
        content: 'https://example.com/video4',
        order: 1
      },
      {
        id: '2-2',
        title: 'Express框架基础',
        description: '学习Express.js的基本用法',
        duration: 90,
        type: 'video',
        content: 'https://example.com/video5',
        order: 2
      }
    ],
    createdAt: '2024-01-10',
    updatedAt: '2024-01-20',
    isPublished: true,
    prerequisites: ['JavaScript基础', 'HTTP协议']
  },
  {
    id: '3',
    title: 'Python数据分析基础',
    description: '使用Python进行数据分析，学习pandas、numpy、matplotlib等核心库的使用。',
    instructor: '张老师',
    instructorId: '4',
    duration: 900, // 15小时
    level: 'beginner',
    category: '数据科学',
    tags: ['Python', '数据分析', 'pandas', 'numpy'],
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
    rating: 4.7,
    enrolledCount: 234,
    lessons: [
      {
        id: '3-1',
        title: 'Python环境配置',
        description: '安装Python和Jupyter Notebook',
        duration: 30,
        type: 'video',
        content: 'https://example.com/video6',
        order: 1
      }
    ],
    createdAt: '2024-01-05',
    updatedAt: '2024-01-18',
    isPublished: true,
    prerequisites: ['基础编程概念']
  },
  {
    id: '4',
    title: 'DevOps实践指南',
    description: '学习现代DevOps实践，包括CI/CD、容器化、监控等。',
    instructor: '李四',
    instructorId: '2',
    duration: 2400, // 40小时
    level: 'advanced',
    category: 'DevOps',
    tags: ['Docker', 'Kubernetes', 'CI/CD', 'Jenkins'],
    thumbnail: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=400',
    rating: 4.9,
    enrolledCount: 67,
    lessons: [
      {
        id: '4-1',
        title: 'DevOps概念介绍',
        description: '了解DevOps的核心理念和实践',
        duration: 60,
        type: 'video',
        content: 'https://example.com/video7',
        order: 1
      }
    ],
    createdAt: '2024-01-08',
    updatedAt: '2024-01-22',
    isPublished: true,
    prerequisites: ['Linux基础', '网络基础', '编程经验']
  }
];

// 模拟学习进度数据
export const mockProgress: Progress[] = [
  {
    id: '1',
    userId: '1',
    courseId: '1',
    completedLessons: ['1-1', '1-2'],
    currentLesson: '1-3',
    completedPercentage: 50,
    timeSpent: 150,
    lastAccessed: '2024-01-20T10:30:00Z',
    startDate: '2024-01-15T09:00:00Z'
  },
  {
    id: '2',
    userId: '1',
    courseId: '3',
    completedLessons: ['3-1'],
    currentLesson: '3-1',
    completedPercentage: 100,
    timeSpent: 900,
    lastAccessed: '2024-01-18T14:30:00Z',
    startDate: '2024-01-10T09:00:00Z',
    completedDate: '2024-01-18T16:00:00Z'
  },
  {
    id: '3',
    userId: '1',
    courseId: '2',
    completedLessons: ['2-1'],
    currentLesson: '2-2',
    completedPercentage: 25,
    timeSpent: 180,
    lastAccessed: '2024-01-21T15:45:00Z',
    startDate: '2024-01-18T10:00:00Z'
  },
  {
    id: '4',
    userId: '1',
    courseId: '4',
    completedLessons: [],
    currentLesson: '4-1',
    completedPercentage: 5,
    timeSpent: 30,
    lastAccessed: '2024-01-22T09:15:00Z',
    startDate: '2024-01-22T09:00:00Z'
  }
];

// 示例测验数据
export const mockQuizzes: Quiz[] = [
  {
    id: 'quiz-1',
    title: 'React基础知识测验',
    description: '测试你对React基础概念的理解',
    courseId: '1',
    lessonId: '1-4',
    questions: [
      {
        id: 'q1',
        type: 'single-choice',
        question: 'React中用于创建组件的函数是？',
        options: ['React.Component', 'React.createElement', 'React.createClass', 'React.render'],
        correctAnswer: 'React.createElement',
        explanation: 'React.createElement是React中用于创建元素的核心函数',
        points: 10,
        order: 1
      },
      {
        id: 'q2',
        type: 'multiple-choice',
        question: '以下哪些是React的核心概念？（多选）',
        options: ['组件', '状态', '属性', '生命周期', '指令'],
        correctAnswer: ['组件', '状态', '属性', '生命周期'],
        explanation: '指令是Angular的概念，React没有指令',
        points: 15,
        order: 2
      },
      {
        id: 'q3',
        type: 'true-false',
        question: 'JSX是JavaScript的一个扩展语法',
        correctAnswer: 'true',
        explanation: 'JSX确实是JavaScript的扩展语法，允许在JS中写HTML-like的代码',
        points: 5,
        order: 3
      }
    ],
    timeLimit: 30,
    passingScore: 70,
    maxAttempts: 3,
    isRandomized: false,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'quiz-2',
    title: 'JavaScript 基础知识测验',
    description: '测试您对 JavaScript 基础语法和概念的掌握程度',
    courseId: '2',
    lessonId: '2-3',
    questions: [
      {
        id: 'q1',
        type: 'single-choice',
        question: '下列哪个关键字用于声明变量？',
        options: ['var', 'let', 'const', '以上都是'],
        correctAnswer: '以上都是',
        points: 10,
        explanation: 'JavaScript 中可以使用 var、let 和 const 三个关键字来声明变量。',
        order: 1
      },
      {
        id: 'q2',
        type: 'multiple-choice',
        question: '下列哪些是 JavaScript 的原始数据类型？',
        options: ['string', 'number', 'boolean', 'object', 'undefined', 'null'],
        correctAnswer: ['string', 'number', 'boolean', 'undefined', 'null'],
        points: 15,
        explanation: 'JavaScript 的原始数据类型包括：string、number、boolean、undefined、null、symbol 和 bigint。object 是引用类型。',
        order: 2
      },
      {
        id: 'q3',
        type: 'true-false',
        question: 'JavaScript 是一种静态类型语言。',
        correctAnswer: 'false',
        points: 5,
        explanation: 'JavaScript 是一种动态类型语言，变量的类型在运行时确定。',
        order: 3
      }
    ],
    timeLimit: 25,
    passingScore: 70,
    maxAttempts: 3,
    isRandomized: false,
    createdAt: '2024-01-10T00:00:00Z'
  }
];

// 示例证书数据
export const mockCertificates: Certificate[] = [
  {
    id: 'cert-1',
    userId: '1',
    courseId: '3',
    courseName: 'Python数据分析基础',
    instructorName: '张老师',
    issueDate: '2024-01-18',
    verificationCode: 'CERT-PY-001-2024',
    grade: 95,
    isValid: true
  }
];

// 示例通知数据
export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    userId: '1',
    title: '课程更新通知',
    content: '您正在学习的"React 入门到精通"课程有新的章节更新',
    type: 'course',
    isRead: false,
    createdAt: '2024-01-20T09:00:00Z',
    actionUrl: '/courses/1'
  },
  {
    id: 'notif-2',
    userId: '1',
    title: '证书颁发',
    content: '恭喜您获得"Python数据分析基础"课程证书！',
    type: 'certificate',
    isRead: true,
    createdAt: '2024-01-18T16:00:00Z',
    actionUrl: '/profile/certificates'
  },
  {
    id: 'notif-3',
    userId: '1',
    title: '新课程推荐',
    content: '根据您的学习记录，为您推荐"DevOps实践指南"课程',
    type: 'course',
    isRead: false,
    createdAt: '2024-01-19T10:00:00Z',
    actionUrl: '/courses/4'
  }
];

// 课程分类
export const courseCategories = [
  '前端开发',
  '后端开发',
  '移动开发',
  '数据科学',
  'DevOps',
  '云计算',
  '人工智能',
  '项目管理',
  '软技能',
  '安全',
  '测试',
  '产品设计'
];

// 技能标签
export const skillTags = [
  'React', 'Vue', 'Angular', 'JavaScript', 'TypeScript',
  'Node.js', 'Python', 'Java', 'Go', 'Rust',
  'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP',
  'MongoDB', 'PostgreSQL', 'Redis', 'Elasticsearch',
  'Machine Learning', 'Data Analysis', 'AI',
  'Agile', 'Scrum', 'Leadership', 'Communication'
];

// 学习活动数据
export const mockLearningActivities = [
  {
    id: 'activity-1',
    userId: '1',
    type: 'lesson_completed',
    title: '完成课程章节',
    description: '完成了"React 入门到精通"课程的"组件与JSX"章节',
    courseId: '1',
    lessonId: '1-2',
    timestamp: '2024-01-20T10:30:00Z',
    points: 10
  },
  {
    id: 'activity-2',
    userId: '1',
    type: 'quiz_passed',
    title: '通过课程测验',
    description: '以95分的成绩通过了"Python数据分析基础"的结业测验',
    courseId: '3',
    score: 95,
    timestamp: '2024-01-18T16:00:00Z',
    points: 50
  },
  {
    id: 'activity-3',
    userId: '1',
    type: 'course_started',
    title: '开始新课程',
    description: '开始学习"企业级Node.js开发"课程',
    courseId: '2',
    timestamp: '2024-01-18T10:00:00Z',
    points: 5
  },
  {
    id: 'activity-4',
    userId: '1',
    type: 'certificate_earned',
    title: '获得证书',
    description: '获得"Python数据分析基础"课程完成证书',
    courseId: '3',
    certificateId: 'cert-1',
    timestamp: '2024-01-18T16:30:00Z',
    points: 100
  },
  {
    id: 'activity-5',
    userId: '1',
    type: 'course_started',
    title: '开始新课程',
    description: '开始学习"DevOps实践指南"课程',
    courseId: '4',
    timestamp: '2024-01-22T09:00:00Z',
    points: 5
  }
];

// 学习统计数据
export const mockLearningStats = {
  userId: '1',
  totalCourses: 4,
  completedCourses: 1,
  inProgressCourses: 3,
  totalLearningTime: 1260, // 21小时
  currentWeekTime: 180, // 3小时
  currentStreak: 5, // 连续学习天数
  longestStreak: 12,
  totalPoints: 1250,
  weeklyGoal: 300, // 5小时/周
  weeklyProgress: 60, // 60%完成
  averageSessionTime: 45, // 平均每次学习45分钟
  favoriteCategory: '前端开发',
  completionRate: 85, // 85%的开始课程最终完成
  lastWeekActivities: 8 // 上周学习活动次数
};

export const currentUser: User = mockUsers[0]; // 默认当前用户为张三
