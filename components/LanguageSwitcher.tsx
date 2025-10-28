import React from 'react';
import { useLocalization } from '../contexts/LocalizationContext';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLocalization();

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
  };

  return (
    <div className="flex justify-center items-center space-x-2 rounded-full bg-gray-800/50 p-1">
      <button
        onClick={() => handleLanguageChange('en')}
        className={`px-3 py-1 text-sm font-medium rounded-full transition-colors duration-300 ${
          language === 'en' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-gray-700/50'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => handleLanguageChange('es')}
        className={`px-3 py-1 text-sm font-medium rounded-full transition-colors duration-300 ${
          language === 'es' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-gray-700/50'
        }`}
      >
        ES
      </button>
    </div>
  );
};

export default LanguageSwitcher;
