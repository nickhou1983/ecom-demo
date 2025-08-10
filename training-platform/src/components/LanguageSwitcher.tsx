import { Select } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Option } = Select;

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
  };

  const languages = [
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ];

  return (
    <Select
      value={i18n.language}
      onChange={handleLanguageChange}
      style={{ width: 120 }}
      size="small"
      suffixIcon={<GlobalOutlined />}
    >
      {languages.map(lang => (
        <Option key={lang.code} value={lang.code}>
          <span style={{ marginRight: '8px' }}>{lang.flag}</span>
          {lang.name}
        </Option>
      ))}
    </Select>
  );
}
