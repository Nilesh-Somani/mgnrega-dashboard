import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold rounded shadow hover:from-yellow-500 hover:to-yellow-600 transition"
    >
      {i18n.language === 'en' ? 'हिंदी में देखें' : 'View in English'}
    </button>
  );
};

export default LanguageSwitcher;
