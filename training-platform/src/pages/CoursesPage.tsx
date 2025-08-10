import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Card, 
  Row, 
  Col, 
  Input, 
  Select, 
  Tag, 
  Button, 
  Avatar, 
  Space, 
  Pagination,
  Slider,
  Typography,
  Rate,
  Divider
} from 'antd';
import { 
  ClockCircleOutlined, 
  UserOutlined,
  PlayCircleOutlined,
  FilterOutlined
} from '@ant-design/icons';
import { mockCourses, courseCategories, skillTags } from '../data/mockData';
import type { Course, CourseFilters } from '../types';

const { Search } = Input;
const { Option } = Select;
const { Title, Text } = Typography;
const { CheckableTag } = Tag;

export default function CoursesPage() {
  const { t } = useTranslation();
  const [courses] = useState<Course[]>(mockCourses);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>(mockCourses);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);
  const [filters, setFilters] = useState<CourseFilters>({});
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const navigate = useNavigate();

  // 筛选课程
  const filterCourses = (newFilters: CourseFilters) => {
    setLoading(true);
    
    setTimeout(() => {
      let filtered = [...courses];

      // 按搜索关键词筛选
      if (newFilters.search) {
        const search = newFilters.search.toLowerCase();
        filtered = filtered.filter(course => 
          course.title.toLowerCase().includes(search) ||
          course.description.toLowerCase().includes(search) ||
          course.instructor.toLowerCase().includes(search) ||
          course.tags.some(tag => tag.toLowerCase().includes(search))
        );
      }

      // 按分类筛选
      if (newFilters.category) {
        filtered = filtered.filter(course => course.category === newFilters.category);
      }

      // 按难度筛选
      if (newFilters.level) {
        filtered = filtered.filter(course => course.level === newFilters.level);
      }

      // 按讲师筛选
      if (newFilters.instructor) {
        filtered = filtered.filter(course => course.instructor === newFilters.instructor);
      }

      // 按时长筛选
      if (newFilters.duration) {
        const [min, max] = newFilters.duration;
        filtered = filtered.filter(course => {
          const hours = course.duration / 60;
          return hours >= min && hours <= max;
        });
      }

      // 按评分筛选
      if (newFilters.rating && newFilters.rating > 0) {
        filtered = filtered.filter(course => course.rating >= newFilters.rating!);
      }

      // 按标签筛选
      if (selectedTags.length > 0) {
        filtered = filtered.filter(course => 
          selectedTags.some(tag => course.tags.includes(tag))
        );
      }

      setFilteredCourses(filtered);
      setCurrentPage(1);
      setLoading(false);
    }, 300);
  };

  const handleSearch = (value: string) => {
    const newFilters = { ...filters, search: value };
    setFilters(newFilters);
    filterCourses(newFilters);
  };

  const handleFilterChange = (key: keyof CourseFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    filterCourses(newFilters);
  };

  const handleTagChange = (tag: string, checked: boolean) => {
    const newTags = checked
      ? [...selectedTags, tag]
      : selectedTags.filter(t => t !== tag);
    setSelectedTags(newTags);
    
    // 立即筛选
    setTimeout(() => filterCourses(filters), 0);
  };

  const resetFilters = () => {
    setFilters({});
    setSelectedTags([]);
    setFilteredCourses(courses);
    setCurrentPage(1);
  };

  // 分页数据
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentCourses = filteredCourses.slice(startIndex, endIndex);

  // 获取所有讲师
  const instructors = Array.from(new Set(courses.map(course => course.instructor)));

  const getLevelText = (level: string) => {
    const levelMap = {
      'beginner': t('courses.levels.beginner'),
      'intermediate': t('courses.levels.intermediate'),
      'advanced': t('courses.levels.advanced')
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
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>{t('courses.title')}</Title>
        <Text type="secondary">
          {t('courses.description')}
        </Text>
      </div>

      {/* 搜索和筛选区域 */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Search
              placeholder={t('courses.searchPlaceholder')}
              allowClear
              size="large"
              onSearch={handleSearch}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} md={4}>
            <Select
              placeholder={t('courses.selectCategory')}
              allowClear
              size="large"
              style={{ width: '100%' }}
              onChange={(value) => handleFilterChange('category', value)}
              value={filters.category}
            >
              {courseCategories.map(category => (
                <Option key={category} value={category}>{category}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} md={4}>
            <Select
              placeholder={t('courses.difficultyLevel')}
              allowClear
              size="large"
              style={{ width: '100%' }}
              onChange={(value) => handleFilterChange('level', value)}
              value={filters.level}
            >
              <Option value="beginner">{t('courses.levels.beginner')}</Option>
              <Option value="intermediate">{t('courses.levels.intermediate')}</Option>
              <Option value="advanced">{t('courses.levels.advanced')}</Option>
            </Select>
          </Col>
          <Col xs={24} md={4}>
            <Select
              placeholder={t('courses.selectInstructor')}
              allowClear
              size="large"
              style={{ width: '100%' }}
              onChange={(value) => handleFilterChange('instructor', value)}
              value={filters.instructor}
            >
              {instructors.map(instructor => (
                <Option key={instructor} value={instructor}>{instructor}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} md={4}>
            <Space>
              <Button 
                icon={<FilterOutlined />} 
                onClick={resetFilters}
                size="large"
              >
                {t('courses.resetFilters')}
              </Button>
            </Space>
          </Col>
        </Row>

        {/* 高级筛选 */}
        <Divider />
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Text strong>{t('courses.courseDuration')}:</Text>
            <Slider
              range
              min={0}
              max={50}
              defaultValue={[0, 50]}
              marks={{ 0: '0h', 25: '25h', 50: '50h+' }}
              onChange={(value) => handleFilterChange('duration', value)}
            />
          </Col>
          <Col xs={24} md={8}>
            <Text strong>{t('courses.courseRating')}:</Text>
            <div style={{ marginTop: '8px' }}>
              <Rate
                allowHalf
                defaultValue={0}
                onChange={(value) => handleFilterChange('rating', value)}
              />
            </div>
          </Col>
        </Row>

        {/* 技能标签 */}
        <div style={{ marginTop: '16px' }}>
          <Text strong>{t('courses.skillTags')}:</Text>
          <div style={{ marginTop: '8px' }}>
            {skillTags.slice(0, 12).map(tag => (
              <CheckableTag
                key={tag}
                checked={selectedTags.includes(tag)}
                onChange={(checked) => handleTagChange(tag, checked)}
                style={{ marginBottom: '8px' }}
              >
                {tag}
              </CheckableTag>
            ))}
          </div>
        </div>
      </Card>

      {/* 课程列表 */}
      <Row gutter={[24, 24]}>
        {currentCourses.map(course => (
          <Col xs={24} sm={12} lg={8} xl={6} key={course.id}>
            <Card
              hoverable
              loading={loading}
              onClick={() => navigate(`/courses/${course.id}`)}
              cover={
                <div style={{ position: 'relative' }}>
                  <img
                    alt={course.title}
                    src={course.thumbnail}
                    style={{ 
                      width: '100%', 
                      height: '200px', 
                      objectFit: 'cover' 
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}>
                    {Math.round(course.duration / 60)}小时
                  </div>
                </div>
              }
              actions={[
                <Button 
                  type="primary" 
                  icon={<PlayCircleOutlined />}
                  size="small"
                  block
                  onClick={() => navigate(`/courses/${course.id}`)}
                >
                  {t('courses.startLearning')}
                </Button>
              ]}
            >
              <Card.Meta
                title={
                  <div>
                    <div style={{ 
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      marginBottom: '8px'
                    }}>
                      {course.title}
                    </div>
                    <Space size="small">
                      <Tag color={getLevelColor(course.level)}>
                        {getLevelText(course.level)}
                      </Tag>
                      <Tag>{course.category}</Tag>
                    </Space>
                  </div>
                }
                description={
                  <div>
                    <div style={{ 
                      height: '40px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      marginBottom: '12px',
                      fontSize: '12px',
                      color: '#666'
                    }}>
                      {course.description}
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Space size="small">
                        <Avatar size="small" icon={<UserOutlined />} />
                        <Text style={{ fontSize: '12px' }}>{course.instructor}</Text>
                      </Space>
                      <Rate 
                        disabled 
                        defaultValue={course.rating} 
                        style={{ fontSize: '12px' }}
                      />
                    </div>
                    
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginTop: '8px'
                    }}>
                      <Space size="small">
                        <ClockCircleOutlined style={{ fontSize: '12px', color: '#666' }} />
                        <Text style={{ fontSize: '12px', color: '#666' }}>
                          {Math.round(course.duration / 60)}{t('courses.duration')}
                        </Text>
                      </Space>
                      <Text style={{ fontSize: '12px', color: '#666' }}>
                        {course.enrolledCount} {t('courses.enrolled')}
                      </Text>
                    </div>
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* 分页 */}
      {filteredCourses.length > pageSize && (
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <Pagination
            current={currentPage}
            total={filteredCourses.length}
            pageSize={pageSize}
            onChange={setCurrentPage}
            showSizeChanger={false}
            showQuickJumper
            showTotal={(total) => `${t('common.total')} ${total} ${t('courses.foundCourses')}`}
          />
        </div>
      )}
    </div>
  );
}
