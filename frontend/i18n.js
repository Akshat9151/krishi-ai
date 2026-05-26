// 🏠 i18n - Simple Multi-language Support
const i18n = {
  lang: localStorage.getItem('krishi_lang') || 'en',

  messages: {
    en: {
      'welcome': 'Welcome to Krishi AI',
      'ask_question': 'Ask a farming question',
      'send': 'Send',
      'voice': 'Speak',
      'loading': 'Loading...',
      'error': 'Error',
      'weather': 'Weather',
      'disease': 'Disease Detection',
      'crop': 'Crop Prediction',
      'dashboard': 'Dashboard',
      'home': 'Home',
      'about': 'About',
      'contact': 'Contact',
      'logout': 'Logout'
    },
    hi: {
      'welcome': 'कृषि एआई में स्वागत है',
      'ask_question': 'कृषि प्रश्न पूछें',
      'send': 'भेजें',
      'voice': 'बोलें',
      'loading': 'लोड हो रहा है...',
      'error': 'त्रुटि',
      'weather': 'मौसम',
      'disease': 'रोग पहचान',
      'crop': 'फसल की भविष्यवाणी',
      'dashboard': 'डैशबोर्ड',
      'home': 'होम',
      'about': 'के बारे में',
      'contact': 'संपर्क',
      'logout': 'लॉग आउट'
    },
    hinglish: {
      'welcome': 'Krishi AI mein welcome hain',
      'ask_question': 'Farming sawal poochein',
      'send': 'Bhejein',
      'voice': 'Bolein',
      'loading': 'Load ho raha hai...',
      'error': 'Error',
      'weather': 'Mausam',
      'disease': 'Disease Detection',
      'crop': 'Crop Prediction',
      'dashboard': 'Dashboard',
      'home': 'Home',
      'about': 'About',
      'contact': 'Contact',
      'logout': 'Logout'
    }
  },

  get(key) {
    return (this.messages[this.lang] && this.messages[this.lang][key]) || key;
  },

  setLang(lang) {
    this.lang = lang;
    localStorage.setItem('krishi_lang', lang);
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
  }
};

window.i18n = i18n;
