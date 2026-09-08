/**
 * Krishi AI - Lightweight Dictionary-based i18n Engine
 * Supports 11 Indian Languages + English:
 * English (en), Hindi (hi), Punjabi (pa), Marathi (mr), Gujarati (gu),
 * Bengali (bn), Tamil (ta), Telugu (te), Kannada (kn), Malayalam (ml), Odia (or)
 */

const KRISHI_LANGUAGES = [
  { code: 'hi', name: 'हिन्दी', native: 'Hindi', flag: '🇮🇳' },
  { code: 'en', name: 'English', native: 'English', flag: '🌐' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ', native: 'Punjabi', flag: '🌾' },
  { code: 'mr', name: 'मराठी', native: 'Marathi', flag: '🚩' },
  { code: 'gu', name: 'ગુજરાતી', native: 'Gujarati', flag: '🌱' },
  { code: 'bn', name: 'বাংলা', native: 'Bengali', flag: '🌿' },
  { code: 'ta', name: 'தமிழ்', native: 'Tamil', flag: '☀️' },
  { code: 'te', name: 'తెలుగు', native: 'Telugu', flag: '🌻' },
  { code: 'kn', name: 'ಕನ್ನಡ', native: 'Kannada', flag: '🍃' },
  { code: 'ml', name: 'മലയാളം', native: 'Malayalam', flag: '🌴' },
  { code: 'or', name: 'ଓଡ଼ିଆ', native: 'Odia', flag: '🌾' }
];

const KRISHI_TRANSLATIONS = {
  // 1. English
  en: {
    // Brand & Global
    brandTitle: "Krishi AI",
    brandSubtitle: "Your Smart Agriculture Assistant",
    farmManagement: "Farm Management",
    commerceAccount: "Commerce & Account",
    langSelect: "Language",
    signIn: "Sign In",
    signOut: "Sign Out",
    welcome: "Welcome",
    farmer: "Farmer",
    farmLead: "Kisan / Farm Lead",
    home: "Home",
    dashboard: "Dashboard",
    agriStore: "AgriStore",
    about: "About",
    contact: "Contact",
    profile: "Profile",
    settings: "Settings",

    // Auth (Login & Register)
    welcomeKrishi: "Welcome to Krishi AI",
    loginTagline: "Your Smart Agriculture Assistant",
    joinKrishi: "Join Krishi AI",
    registerTagline: "Start your smart farming journey",
    username: "Username",
    usernamePlaceholder: "Enter your username",
    usernameChoose: "Choose your username",
    password: "Password",
    passwordPlaceholder: "Enter your password",
    passwordCreate: "Create a strong password",
    confirmPassword: "Confirm Password",
    confirmPasswordPlaceholder: "Confirm your password",
    agreeTerms: "I agree to the Terms of Service and Privacy Policy",
    termsLink: "Terms of Service",
    privacyLink: "Privacy Policy",
    loginBtn: "Login to Your Farm",
    registerBtn: "Create Account",
    newToKrishi: "New to Krishi AI?",
    createAccount: "Create an account",
    alreadyHaveAccount: "Already have an account?",
    loginHere: "Login here",
    passwordsDoNotMatch: "Passwords do not match!",
    passwordLengthWarn: "Password must be at least 8 characters long!",
    loginSuccess: "Login successful! Redirecting...",
    registerSuccess: "Registration successful! Redirecting...",
    serverError: "Error connecting to server. Please try again.",

    // Dashboard Views & Titles
    dashTitle: "Dashboard",
    dashSubtitle: "Overview and farm health metrics",
    cropRecTitle: "Crop Recommendation",
    cropRecSubtitle: "Predict optimal crop yields based on soil and real-time weather",
    diseaseTitle: "Disease Detection",
    diseaseSubtitle: "Identify crop diseases and recommended remedies",
    assistantTitle: "AI Assistant",
    assistantSubtitle: "Consult Krishi AI in Hindi or Hinglish",
    weatherTitle: "Weather Insights",
    weatherSubtitle: "Local meteorological conditions and farming tips",
    ordersTitle: "My Orders",
    ordersSubtitle: "Track and review your AgriStore purchases",
    profileTitle: "Profile",
    profileSubtitle: "Manage account credentials and security",
    settingsTitle: "Settings",
    settingsSubtitle: "Preferences and platform configuration",

    // Dashboard Stats
    statCropsRecommended: "Crops Recommended",
    statDiseasesIdentified: "Diseases Identified",
    statWeatherStation: "Weather Station",
    statDaysActive: "Days Active",
    weatherConnected: "Connected",

    // Forms: Crop Recommendation
    soilType: "Soil Type",
    selectSoilType: "Select Soil Type",
    soilAlluvial: "Alluvial (जलोढ़)",
    soilBlack: "Black (काली मिट्टी)",
    soilClay: "Clay (चिकनी मिट्टी)",
    soilLoamy: "Loamy (दोमट)",
    soilRed: "Red (लाल मिट्टी)",
    soilSandy: "Sandy (बलुई मिट्टी)",
    cityLocation: "City / Location",
    cityPlaceholder: "e.g. Indore, Jaipur, Nashik",
    season: "Season",
    selectSeason: "Select Season",
    seasonKharif: "Kharif (Monsoon)",
    seasonRabi: "Rabi (Winter)",
    seasonZaid: "Zaid (Summer)",
    seasonSummer: "Summer",
    seasonMonsoon: "Monsoon",
    seasonWinter: "Winter",
    predictCropBtn: "Predict Best Crops",
    predictingWait: "Fetching crop recommendations based on soil, location and season...",

    // Forms: Disease Detection
    plantDiagnosis: "Plant Diagnosis",
    uploadPlantPhoto: "Upload Plant Photo",
    uploadPlantDesc: "Preview crop leaf or stem photo",
    cropName: "Crop Name",
    cropNamePlaceholder: "e.g. wheat, rice, cotton, maize",
    diagnoseBtn: "Diagnose Disease & Remedies",

    // Forms: Weather
    checkWeatherCity: "City Name",
    checkWeatherPlaceholder: "Enter district or city, e.g. Bhopal",
    getWeatherBtn: "Get Weather Forecast",

    // Store & Cart
    searchStorePlaceholder: "Search 'NPK Fertilizer', 'Wheat Seeds', 'Sprayer'...",
    deliveryTime: "🌱 Certified Farm Delivery",
    storeSubheader: "🌾 Certified Seeds, Fertilizers & Tools — Directly to Your Farm",
    helpline: "📞 Helpline: 1800-123-4567 (Toll Free)",
    cart: "Cart",
    cartEmpty: "Your cart is empty",
    total: "Total",
    checkout: "Proceed to Checkout",
    addToCart: "Add to Cart",
    buyNow: "Buy Now",

    // Features grid (Register)
    featCropRec: "Crop Recommendations",
    featWeather: "Weather Insights",
    featAssistant: "AI Assistant",
    featAnalytics: "Farm Analytics"
  },

  // 2. Hindi (Default recommended for Indian farmers)
  hi: {
    brandTitle: "कृषि AI",
    brandSubtitle: "आपका स्मार्ट कृषि सहायक",
    farmManagement: "कृषि प्रबंधन",
    commerceAccount: "खरीदारी व खाता",
    langSelect: "भाषा",
    signIn: "लॉग इन",
    signOut: "लॉग आउट",
    welcome: "नमस्ते",
    farmer: "किसान",
    farmLead: "किसान / फार्म लीडर",
    home: "होम",
    dashboard: "डैशबोर्ड",
    agriStore: "कृषि स्टोर",
    about: "हमारे बारे में",
    contact: "संपर्क करें",
    profile: "प्रोफाइल",
    settings: "सेटिंग्स",

    welcomeKrishi: "कृषि AI में आपका स्वागत है",
    loginTagline: "आपका स्मार्ट कृषि सहायक",
    joinKrishi: "कृषि AI से जुड़ें",
    registerTagline: "अपनी उन्नत खेती का सफर शुरू करें",
    username: "उपयोगकर्ता नाम",
    usernamePlaceholder: "अपना यूज़रनेम दर्ज करें",
    usernameChoose: "अपना पसंदीदा यूज़रनेम चुनें",
    password: "पासवर्ड",
    passwordPlaceholder: "अपना पासवर्ड दर्ज करें",
    passwordCreate: "एक मजबूत पासवर्ड बनाएं",
    confirmPassword: "पासवर्ड की पुष्टि करें",
    confirmPasswordPlaceholder: "अपना पासवर्ड दोबारा दर्ज करें",
    agreeTerms: "मैं सेवा की शर्तों और गोपनीयता नीति से सहमत हूँ",
    termsLink: "सेवा की शर्तें",
    privacyLink: "गोपनीयता नीति",
    loginBtn: "अपने खेत में प्रवेश करें (लॉगिन)",
    registerBtn: "नया खाता बनाएं",
    newToKrishi: "कृषि AI पर नए हैं?",
    createAccount: "नया खाता बनाएं",
    alreadyHaveAccount: "क्या आपका पहले से खाता है?",
    loginHere: "यहाँ लॉगिन करें",
    passwordsDoNotMatch: "दोनों पासवर्ड मेल नहीं खाते!",
    passwordLengthWarn: "पासवर्ड कम से कम 8 अक्षरों का होना चाहिए!",
    loginSuccess: "लॉगिन सफल! डैशबोर्ड पर ले जा रहे हैं...",
    registerSuccess: "पंजीकरण सफल! लॉगिन पर ले जा रहे हैं...",
    serverError: "सर्वर से संपर्क करने में त्रुटि। कृपया पुनः प्रयास करें।",

    dashTitle: "डैशबोर्ड",
    dashSubtitle: "आपके खेत का समग्र विवरण और स्वास्थ्य मेट्रिक्स",
    cropRecTitle: "फसल सिफारिश (सलाह)",
    cropRecSubtitle: "मिट्टी और मौसम के आधार पर सबसे उपयुक्त फसल जानें",
    diseaseTitle: "रोग पहचान व उपचार",
    diseaseSubtitle: "फसल के रोगों की पहचान करें और सही उपाय पाएं",
    assistantTitle: "AI कृषि सहायक",
    assistantSubtitle: "हिंदी और हिंग्लिश में तुरंत कृषि सलाह लें",
    weatherTitle: "मौसम की जानकारी",
    weatherSubtitle: "स्थानीय मौसम का पूर्वानुमान और खेती के महत्वपूर्ण सुझाव",
    ordersTitle: "मेरे ऑर्डर्स",
    ordersSubtitle: "कृषि स्टोर की अपनी खरीदारी ट्रैक करें",
    profileTitle: "प्रोफाइल",
    profileSubtitle: "खाता विवरण और सुरक्षा प्रबंधित करें",
    settingsTitle: "सेटिंग्स",
    settingsSubtitle: "अपनी भाषा और ऐप प्राथमिकताएं बदलें",

    statCropsRecommended: "अनुशंसित फसलें",
    statDiseasesIdentified: "पहचाने गए रोग",
    statWeatherStation: "मौसम केंद्र",
    statDaysActive: "सक्रिय दिन",
    weatherConnected: "कनेक्टेड",

    soilType: "मिट्टी का प्रकार",
    selectSoilType: "मिट्टी का प्रकार चुनें",
    soilAlluvial: "जलोढ़ मिट्टी (Alluvial)",
    soilBlack: "काली मिट्टी (Black Soil)",
    soilClay: "चिकनी मिट्टी (Clay)",
    soilLoamy: "दोमट मिट्टी (Loamy)",
    soilRed: "लाल मिट्टी (Red Soil)",
    soilSandy: "बलुई मिट्टी (Sandy)",
    cityLocation: "शहर / जिला",
    cityPlaceholder: "जैसे: इंदौर, जयपुर, नासिक, भोपाल",
    season: "मौसम / ऋतु",
    selectSeason: "ऋतु चुनें",
    seasonKharif: "खरीफ (मानसून)",
    seasonRabi: "रबी (सर्दियां)",
    seasonZaid: "जायद (गर्मी)",
    seasonSummer: "गर्मी (Summer)",
    seasonMonsoon: "मानसून (Monsoon)",
    seasonWinter: "सर्दी (Winter)",
    predictCropBtn: "सर्वश्रेष्ठ फसलों का सुझाव पाएं",
    predictingWait: "मिट्टी और मौसम का विश्लेषण कर रहे हैं...",

    plantDiagnosis: "फसल रोग निदान",
    uploadPlantPhoto: "पौधे/पत्ती की फोटो अपलोड करें",
    uploadPlantDesc: "पत्ती या तने की साफ फोटो चुनें",
    cropName: "फसल का नाम",
    cropNamePlaceholder: "जैसे: गेहूं, धान, कपास, मक्का, सोयाबीन",
    diagnoseBtn: "रोग पहचानें और उपचार देखें",

    checkWeatherCity: "शहर / जिले का नाम",
    checkWeatherPlaceholder: "अपना जिला दर्ज करें, जैसे: भोपाल",
    getWeatherBtn: "मौसम पूर्वानुमान देखें",

    searchStorePlaceholder: "सर्च करें 'NPK खाद', 'गेहूं बीज', 'स्प्रेयर'...",
    deliveryTime: "🌱 सत्यापित कृषि डिलीवरी",
    storeSubheader: "🌾 सत्यापित बीज, खाद व उपकरण — सीधे आपके खेत तक",
    helpline: "📞 हेल्पलाइन: 1800-123-4567 (टोल फ्री)",
    cart: "कार्ट",
    cartEmpty: "आपकी कार्ट खाली है",
    total: "कुल योग",
    checkout: "ऑर्डर करें (Checkout)",
    addToCart: "कार्ट में जोड़ें",
    buyNow: "अभी खरीदें",

    featCropRec: "फसल सिफारिश",
    featWeather: "मौसम पूर्वानुमान",
    featAssistant: "AI कृषि सहायक",
    featAnalytics: "फार्म एनालिटिक्स"
  },

  // 3. Punjabi
  pa: {
    brandTitle: "ਕ੍ਰਿਸ਼ੀ AI",
    brandSubtitle: "ਤੁਹਾਡਾ ਸਮਾਰਟ ਖੇਤੀ ਸਹਾਇਕ",
    farmManagement: "ਖੇਤੀ ਪ੍ਰਬੰਧਨ",
    commerceAccount: "ਖਰੀਦਦਾਰੀ ਅਤੇ ਖਾਤਾ",
    langSelect: "ਭਾਸ਼ਾ",
    signIn: "ਲਾਗਇਨ",
    signOut: "ਲਾਗ ਆਉਟ",
    welcome: "ਜੀ ਆਇਆਂ ਨੂੰ",
    farmer: "ਕਿਸਾਨ",
    farmLead: "ਕਿਸਾਨ ਵੀਰ / ਫਾਰਮ ਲੀਡਰ",
    home: "ਮੁੱਖ ਪੰਨਾ",
    dashboard: "ਡੈਸ਼ਬੋਰਡ",
    agriStore: "ਕ੍ਰਿਸ਼ੀ ਸਟੋਰ",
    about: "ਸਾਡੇ ਬਾਰੇ",
    contact: "ਸੰਪਰਕ ਕਰੋ",
    profile: "ਪ੍ਰੋਫਾਈਲ",
    settings: "ਸੈਟਿੰਗਾਂ",

    welcomeKrishi: "ਕ੍ਰਿਸ਼ੀ AI ਵਿੱਚ ਜੀ ਆਇਆਂ ਨੂੰ",
    loginTagline: "ਤੁਹਾਡਾ ਸਮਾਰਟ ਖੇਤੀ ਸਹਾਇਕ",
    joinKrishi: "ਕ੍ਰਿਸ਼ੀ AI ਨਾਲ ਜੁੜੋ",
    registerTagline: "ਆਪਣੀ ਆਧੁਨਿਕ ਖੇਤੀ ਦਾ ਸਫ਼ਰ ਸ਼ੁਰੂ ਕਰੋ",
    username: "ਯੂਜ਼ਰਨੇਮ",
    usernamePlaceholder: "ਆਪਣਾ ਯੂਜ਼ਰਨੇਮ ਦਰਜ ਕਰੋ",
    usernameChoose: "ਯੂਜ਼ਰਨੇਮ ਚੁਣੋ",
    password: "ਪਾਸਵਰਡ",
    passwordPlaceholder: "ਆਪਣਾ ਪਾਸਵਰਡ ਦਰਜ ਕਰੋ",
    passwordCreate: "ਮਜ਼ਬੂਤ ਪਾਸਵਰਡ ਬਣਾਓ",
    confirmPassword: "ਪਾਸਵਰਡ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ",
    confirmPasswordPlaceholder: "ਪਾਸਵਰਡ ਦੁਬਾਰਾ ਦਰਜ ਕਰੋ",
    agreeTerms: "ਮੈਂ ਸੇਵਾ ਸ਼ਰਤਾਂ ਅਤੇ ਪਰਾਈਵੇਸੀ ਨੀਤੀ ਨਾਲ ਸਹਿਮਤ ਹਾਂ",
    termsLink: "ਸੇਵਾ ਸ਼ਰਤਾਂ",
    privacyLink: "ਪਰਾਈਵੇਸੀ ਨੀਤੀ",
    loginBtn: "ਖੇਤ ਵਿੱਚ ਪ੍ਰਵੇਸ਼ ਕਰੋ (ਲਾਗਇਨ)",
    registerBtn: "ਖਾਤਾ ਬਣਾਓ",
    newToKrishi: "ਕ੍ਰਿਸ਼ੀ AI 'ਤੇ ਨਵੇਂ ਹੋ?",
    createAccount: "ਨਵਾਂ ਖਾਤਾ ਬਣਾਓ",
    alreadyHaveAccount: "ਕੀ ਪਹਿਲਾਂ ਤੋਂ ਖਾਤਾ ਹੈ?",
    loginHere: "ਇੱਥੇ ਲਾਗਇਨ ਕਰੋ",
    passwordsDoNotMatch: "ਪਾਸਵਰਡ ਮੇਲ ਨਹੀਂ ਖਾਂਦੇ!",
    passwordLengthWarn: "ਪਾਸਵਰਡ ਘੱਟੋ-ਘੱਟ 8 ਅੱਖਰਾਂ ਦਾ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ!",
    loginSuccess: "ਲਾਗਇਨ ਸਫਲ! ਡੈਸ਼ਬੋਰਡ ਖੁੱਲ ਰਿਹਾ ਹੈ...",
    registerSuccess: "ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਸਫਲ! ਲਾਗਇਨ ਪੰਨੇ 'ਤੇ ਜਾ ਰਹੇ ਹਾਂ...",
    serverError: "ਸਰਵਰ ਨਾਲ ਜੁੜਨ ਵਿੱਚ ਸਮੱਸਿਆ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",

    dashTitle: "ਡੈਸ਼ਬੋਰਡ",
    dashSubtitle: "ਖੇਤ ਦੀ ਕਾਰਗੁਜ਼ਾਰੀ ਅਤੇ ਸਿਹਤ ਰਿਪੋਰਟ",
    cropRecTitle: "ਫ਼ਸਲ ਸਿਫਾਰਿਸ਼",
    cropRecSubtitle: "ਮਿੱਟੀ ਅਤੇ ਮੌਸਮ ਮੁਤਾਬਕ ਸਹੀ ਫ਼ਸਲ ਚੁਣੋ",
    diseaseTitle: "ਬਿਮਾਰੀ ਦੀ ਜਾਂਚ",
    diseaseSubtitle: "ਫ਼ਸਲ ਦੇ ਰੋਗ ਪਛਾਣੋ ਅਤੇ ਇਲਾਜ ਜਾਣੋ",
    assistantTitle: "AI ਖੇਤੀ ਸਹਾਇਕ",
    assistantSubtitle: "ਆਪਣੀ ਭਾਸ਼ਾ ਵਿੱਚ ਖੇਤੀ ਸੰਬੰਧੀ ਸਵਾਲ ਪੁੱਛੋ",
    weatherTitle: "ਮੌਸਮ ਜਾਣਕਾਰੀ",
    weatherSubtitle: "ਤਾਜ਼ਾ ਮੌਸਮ ਜਾਣਕਾਰੀ ਅਤੇ ਖੇਤੀ ਸੁਝਾਅ",
    ordersTitle: "ਮੇਰੇ ਆਰਡਰ",
    ordersSubtitle: "ਖਰੀਦੇ ਗਏ ਸਾਮਾਨ ਦੀ ਜਾਣਕਾਰੀ",
    profileTitle: "ਪ੍ਰੋਫਾਈਲ",
    profileSubtitle: "ਖਾਤਾ ਅਤੇ ਸੁਰੱਖਿਆ ਜਾਣਕਾਰੀ",
    settingsTitle: "ਸੈਟਿੰਗਾਂ",
    settingsSubtitle: "ਐਪ ਸੈਟਿੰਗਾਂ ਅਤੇ ਤਰਜੀਹਾਂ",

    statCropsRecommended: "ਸਿਫਾਰਸ਼ ਕੀਤੀਆਂ ਫ਼ਸਲਾਂ",
    statDiseasesIdentified: "ਪਛਾਣੇ ਗਏ ਰੋਗ",
    statWeatherStation: "ਮੌਸਮ ਕੇਂਦਰ",
    statDaysActive: "ਕੁੱਲ ਦਿਨ",
    weatherConnected: "ਕਨੈਕਟਡ",

    soilType: "ਮਿੱਟੀ ਦੀ ਕਿਸਮ",
    selectSoilType: "ਮਿੱਟੀ ਦੀ ਕਿਸਮ ਚੁਣੋ",
    soilAlluvial: "ਜਲੋਢ ਮਿੱਟੀ (Alluvial)",
    soilBlack: "ਕਾਲੀ ਮਿੱਟੀ (Black)",
    soilClay: "ਚੀਕਣੀ ਮਿੱਟੀ (Clay)",
    soilLoamy: "ਦੋਮਟ ਮਿੱਟੀ (Loamy)",
    soilRed: "ਲਾਲ ਮਿੱਟੀ (Red)",
    soilSandy: "ਰੇਤਲੀ ਮਿੱਟੀ (Sandy)",
    cityLocation: "ਸ਼ਹਿਰ / ਜ਼ਿਲ੍ਹਾ",
    cityPlaceholder: "ਜਿਵੇਂ: ਲੁਧਿਆਣਾ, ਅੰਮ੍ਰਿਤਸਰ, ਬਠਿੰਡਾ",
    season: "ਮੌਸਮ / ਸੀਜ਼ਨ",
    selectSeason: "ਸੀਜ਼ਨ ਚੁਣੋ",
    seasonKharif: "ਸਾਉਣੀ (ਖਰੀਫ਼)",
    seasonRabi: "ਹਾੜ੍ਹੀ (ਰਬੀ)",
    seasonZaid: "ਜ਼ਾਇਦ",
    seasonSummer: "ਗਰਮੀ",
    seasonMonsoon: "ਮਾਨਸੂਨ",
    seasonWinter: "ਸਰਦੀ",
    predictCropBtn: "ਵਧੀਆ ਫ਼ਸਲਾਂ ਦੀ ਸਿਫਾਰਸ਼ ਲਵੋ",
    predictingWait: "ਜਾਣਕਾਰੀ ਪ੍ਰਾਪਤ ਕੀਤੀ ਜਾ ਰਹੀ ਹੈ...",

    plantDiagnosis: "ਪੌਦੇ ਦੀ ਬਿਮਾਰੀ ਜਾਂਚ",
    uploadPlantPhoto: "ਪੌਦੇ ਦੀ ਫੋਟੋ ਅਪਲੋਡ ਕਰੋ",
    uploadPlantDesc: "ਪੱਤੇ ਜਾਂ ਤਣੇ ਦੀ ਸਾਫ਼ ਤਸਵੀਰ ਚੁਣੋ",
    cropName: "ਫ਼ਸਲ ਦਾ ਨਾਂ",
    cropNamePlaceholder: "ਜਿਵੇਂ: ਕਣਕ, ਝੋਨਾ, ਨਰਮਾ, ਮੱਕੀ",
    diagnoseBtn: "ਰੋਗ ਦੀ ਪਛਾਣ ਅਤੇ ਇਲਾਜ ਦੇਖੋ",

    checkWeatherCity: "ਸ਼ਹਿਰ / ਜ਼ਿਲ੍ਹਾ",
    checkWeatherPlaceholder: "ਆਪਣਾ ਜ਼ਿਲ੍ਹਾ ਦਰਜ ਕਰੋ, ਜਿਵੇਂ: ਲੁਧਿਆਣਾ",
    getWeatherBtn: "ਮੌਸਮ ਜਾਣਕਾਰੀ ਵੇਖੋ",

    searchStorePlaceholder: "ਖਾਦ, ਬੀਜ, ਸਪਰੇਅ ਪੰਪ ਲੱਭੋ...",
    deliveryTime: "🌱 ਪ੍ਰਮਾਣਿਤ ਖੇਤੀ ਡਿਲੀਵਰੀ",
    storeSubheader: "🌾 ਪ੍ਰਮਾਣਿਤ ਬੀਜ, ਖਾਦ ਅਤੇ ਔਜ਼ਾਰ — ਸਿੱਧੇ ਤੁਹਾਡੇ ਖੇਤ ਤੱਕ",
    helpline: "📞 ਹੈਲਪਲਾਈਨ: 1800-123-4567 (ਮੁਫ਼ਤ)",
    cart: "ਕਾਰਟ",
    cartEmpty: "ਤੁਹਾਡੀ ਕਾਰਟ ਖਾਲੀ ਹੈ",
    total: "ਕੁੱਲ ਰਕਮ",
    checkout: "ਆਰਡਰ ਕਰੋ",
    addToCart: "ਕਾਰਟ ਵਿੱਚ ਪਾਓ",
    buyNow: "ਹੁਣੇ ਖਰੀਦੋ",

    featCropRec: "ਫ਼ਸਲ ਸਿਫਾਰਿਸ਼",
    featWeather: "ਮੌਸਮ ਜਾਣਕਾਰੀ",
    featAssistant: "AI ਖੇਤੀ ਸਹਾਇਕ",
    featAnalytics: "ਫਾਰਮ ਐਨਾਲਿਟਿਕਸ"
  },

  // 4. Marathi
  mr: {
    brandTitle: "कृषी AI",
    brandSubtitle: "तुमचा स्मार्ट शेती सहाय्यक",
    farmManagement: "शेती व्यवस्थापन",
    commerceAccount: "खरेदी आणि खाते",
    langSelect: "भाषा",
    signIn: "लॉगिन",
    signOut: "बाहेर पडा (Sign Out)",
    welcome: "स्वागत आहे",
    farmer: "शेतकरी",
    farmLead: "शेतकरी मित्र / फार्म लीड",
    home: "मुख्यपृष्ठ",
    dashboard: "डॅशबोर्ड",
    agriStore: "कृषी स्टोअर",
    about: "आमच्याबद्दल",
    contact: "संपर्क",
    profile: "प्रोफाइल",
    settings: "सेटिंग्ज",

    welcomeKrishi: "कृषी AI मध्ये स्वागत आहे",
    loginTagline: "तुमचा स्मार्ट शेती सहाय्यक",
    joinKrishi: "कृषी AI शी जोडा",
    registerTagline: "तुमचा आधुनिक शेतीचा प्रवास सुरू करा",
    username: "वापरकर्ता नाव (Username)",
    usernamePlaceholder: "युझरनेम टाका",
    usernameChoose: "युझरनेम निवडा",
    password: "पासवर्ड",
    passwordPlaceholder: "पासवर्ड टाका",
    passwordCreate: "मजबूत पासवर्ड तयार करा",
    confirmPassword: "पासवर्डची पुष्टी करा",
    confirmPasswordPlaceholder: "पासवर्ड पुन्हा टाका",
    agreeTerms: "मी सेवा अटी आणि गोपनीयता धोरणाशी सहमत आहे",
    termsLink: "सेवा अटी",
    privacyLink: "गोपनीयता धोरण",
    loginBtn: "शेतात प्रवेश करा (लॉगिन)",
    registerBtn: "नवीन खाते तयार करा",
    newToKrishi: "कृषी AI वर नवीन आहात?",
    createAccount: "खाते उघडा",
    alreadyHaveAccount: "आधीच खाते आहे का?",
    loginHere: "येथे लॉगिन करा",
    passwordsDoNotMatch: "पासवर्ड जुळत नाहीत!",
    passwordLengthWarn: "पासवर्ड किमान ८ अक्षरांचा असावा!",
    loginSuccess: "लॉगिन यशस्वी! डॅशबोर्ड सुरू होत आहे...",
    registerSuccess: "नोंदणी यशस्वी! लॉगिन पृष्ठावर जात आहे...",
    serverError: "सर्व्हरशी संपर्क होत नाही. पुन्हा प्रयत्न करा.",

    dashTitle: "डॅशबोर्ड",
    dashSubtitle: "शेतीचे संपूर्ण अवलोकन व आरोग्य निर्देशांक",
    cropRecTitle: "पीक शिफारस (सल्ला)",
    cropRecSubtitle: "माती आणि हवामानानुसार योग्य पीक निवडा",
    diseaseTitle: "रोग निदान व उपाय",
    diseaseSubtitle: "पिकांवरील रोग ओळखा आणि उपाय मिळवा",
    assistantTitle: "AI कृषी सहाय्यक",
    assistantSubtitle: "शेतीविषयक सर्व प्रश्नांची मराठीत उत्तरे",
    weatherTitle: "हवामान अंदाज",
    weatherSubtitle: "स्थानिक हवामान आणि शेतीसाठी उपयुक्त सूचना",
    ordersTitle: "माझ्या ऑर्डर्स",
    ordersSubtitle: "खरेदी केलेल्या वस्तूंची माहिती",
    profileTitle: "माझे प्रोफाइल",
    profileSubtitle: "खाते आणि सुरक्षा व्यवस्थापन",
    settingsTitle: "सेटिंग्ज",
    settingsSubtitle: "अॅप प्राधान्ये आणि भाषा बदला",

    statCropsRecommended: "शिफारस केलेली पिके",
    statDiseasesIdentified: "निदान झालेले रोग",
    statWeatherStation: "हवामान केंद्र",
    statDaysActive: "सक्रिय दिवस",
    weatherConnected: "कनेक्ट झाले",

    soilType: "मातीचा प्रकार",
    selectSoilType: "मातीचा प्रकार निवडा",
    soilAlluvial: "गाळाची माती (Alluvial)",
    soilBlack: "काळी माती (Black Soil)",
    soilClay: "चिकण माती (Clay)",
    soilLoamy: "दुमट माती (Loamy)",
    soilRed: "तांबडी माती (Red Soil)",
    soilSandy: "वाळूमिश्रित माती (Sandy)",
    cityLocation: "शहर / जिल्हा",
    cityPlaceholder: "उदा. नाशिक, पुणे, सोलापूर, नागपूर",
    season: "हंगाम / ऋतू",
    selectSeason: "हंगाम निवडा",
    seasonKharif: "खरीप (पावसाळी)",
    seasonRabi: "रब्बी (हिवाळी)",
    seasonZaid: "उन्हाळी (झायद)",
    seasonSummer: "उन्हाळा",
    seasonMonsoon: "पावसाळा",
    seasonWinter: "हिवाळा",
    predictCropBtn: "योग्य पिकांची शिफारस मिळवा",
    predictingWait: "माती व हवामानाचा अभ्यास चालू आहे...",

    plantDiagnosis: "पीक रोग निदान",
    uploadPlantPhoto: "झाडाचा / पानाचा फोटो जोडा",
    uploadPlantDesc: "पानाचा किंवा खोडाचा स्पष्ट फोटो अपलोड करा",
    cropName: "पिकाचे नाव",
    cropNamePlaceholder: "उदा. कापूस, सोयाबीन, गहू, कांदा, ऊस",
    diagnoseBtn: "रोग ओळखा आणि औषधे जाणून घ्या",

    checkWeatherCity: "जिल्हा / शहर",
    checkWeatherPlaceholder: "उदा. नाशिक",
    getWeatherBtn: "हवामान पहा",

    searchStorePlaceholder: "खते, बियाणे, कीटकनाशके शोधा...",
    deliveryTime: "🌱 प्रमाणित कृषी डिलिव्हरी",
    storeSubheader: "🌾 प्रमाणित बियाणे, खते व अवजारे — थेट तुमच्या शेतावर",
    helpline: "📞 हेल्पलाइन: १८००-१२३-४५६७ (मोफत)",
    cart: "कार्ट",
    cartEmpty: "तुमची कार्ट रिकामी आहे",
    total: "एकूण रक्कम",
    checkout: "ऑर्डर करा",
    addToCart: "कार्टमध्ये जोडा",
    buyNow: "आत्ताच खरेदी करा",

    featCropRec: "पीक शिफारस",
    featWeather: "हवामान अंदाज",
    featAssistant: "AI कृषी सल्लागार",
    featAnalytics: "शेती विश्लेषण"
  },

  // 5. Gujarati
  gu: {
    brandTitle: "કૃષિ AI",
    brandSubtitle: "તમારો સ્માર્ટ કૃષિ સહાયક",
    farmManagement: "ખેતી વ્યવસ્થાપન",
    commerceAccount: "ખરીદી અને ખાતું",
    langSelect: "ભાષા",
    signIn: "લૉગિન",
    signOut: "સાઇન આઉટ",
    welcome: "સ્વાગત છે",
    farmer: "ખેડૂત મિત્ર",
    farmLead: "ખેડૂત / ફાર્મ લીડર",
    home: "હોમ",
    dashboard: "ડેશબોર્ડ",
    agriStore: "કૃષિ સ્ટોર",
    about: "અમારા વિશે",
    contact: "સંપર્ક કરો",
    profile: "પ્રોફાઇલ",
    settings: "સેટિંગ્સ",

    welcomeKrishi: "કૃષિ AI માં સ્વાગત છે",
    loginTagline: "તમારો સ્માર્ટ ખેતી સહાયક",
    joinKrishi: "કૃષિ AI સાથે જોડાઓ",
    registerTagline: "તમારી આધુનિક ખેતીની શરૂઆત કરો",
    username: "વપરાશકર્તા નામ (Username)",
    usernamePlaceholder: "યુઝરનેમ દાખલ કરો",
    usernameChoose: "યુઝરનેમ પસંદ કરો",
    password: "પાસવર્ડ",
    passwordPlaceholder: "પાસવર્ડ દાખલ કરો",
    passwordCreate: "મજબૂત પાસવર્ડ બનાવો",
    confirmPassword: "પાસવર્ડની પુષ્ટિ કરો",
    confirmPasswordPlaceholder: "પાસવર્ડ ફરી દાખલ કરો",
    agreeTerms: "હું સેવાની શરતો અને ગોપનીયતા નીતિ સાથે સંમત છું",
    termsLink: "સેવાની શરતો",
    privacyLink: "ગોપનીયતા નીતિ",
    loginBtn: "ખેતરમાં પ્રવેશ કરો (લૉગિન)",
    registerBtn: "નવું ખાતું બનાવો",
    newToKrishi: "કૃષિ AI પર નવા છો?",
    createAccount: "ખાતું બનાવો",
    alreadyHaveAccount: "પહેલેથી ખાતું છે?",
    loginHere: "અહીં લૉગિન કરો",
    passwordsDoNotMatch: "પાસવર્ડ મેળ ખાતા નથી!",
    passwordLengthWarn: "પાસવર્ડ ઓછામાં ઓછો 8 અક્ષરોનો હોવો જોઈએ!",
    loginSuccess: "લૉગિન સફળ! ડેશબોર્ડ ખૂલી રહ્યું છે...",
    registerSuccess: "નોંધણી સફળ! લૉગિન પેજ પર જઈ રહ્યાં છીએ...",
    serverError: "સર્વર સાથે સંપર્ક થઈ શકતો નથી.",

    dashTitle: "ડેશબોર્ડ",
    dashSubtitle: "તમારા ખેતરની સમગ્ર માહિતી અને સ્વાસ્થ્ય",
    cropRecTitle: "પાક ભલામણ (સલાહ)",
    cropRecSubtitle: "જમીન અને હવામાન મુજબ શ્રેષ્ઠ પાક પસંદ કરો",
    diseaseTitle: "રોગ નિદાન અને ઉપચાર",
    diseaseSubtitle: "પાકના રોગો ઓળખો અને તાત્કાલિક ઉપાય મેળવો",
    assistantTitle: "AI કૃષિ સહાયક",
    assistantSubtitle: "ખેતી સંબંધી તમામ પ્રશ્નોના જવાબો મેળવો",
    weatherTitle: "હવામાન માહિતી",
    weatherSubtitle: "સ્થાનિક હવામાન અને ખેતી માટે મહત્વપૂર્ણ સલાહ",
    ordersTitle: "મારા ઓર્ડર્સ",
    ordersSubtitle: "ખરીદીની વિગતો તપાસો",
    profileTitle: "પ્રોફાઇલ",
    profileSubtitle: "ખાતાની સુરક્ષા અને વિગતો",
    settingsTitle: "સેટિંગ્સ",
    settingsSubtitle: "ભાષા અને એપ્લિકેશન પસંદગીઓ",

    statCropsRecommended: "ભલામણ કરેલ પાકો",
    statDiseasesIdentified: "ઓળખાયેલા રોગો",
    statWeatherStation: "હવામાન કેન્દ્ર",
    statDaysActive: "સક્રિય દિવસો",
    weatherConnected: "કનેક્ટેડ",

    soilType: "જમીનનો પ્રકાર",
    selectSoilType: "જમીનનો પ્રકાર પસંદ કરો",
    soilAlluvial: "કાંપવાળી જમીન (Alluvial)",
    soilBlack: "કાળી જમીન (Black Soil)",
    soilClay: "ચીકણી જમીન (Clay)",
    soilLoamy: "ગોરાડુ જમીન (Loamy)",
    soilRed: "રાતી જમીન (Red Soil)",
    soilSandy: "રેતાળ જમીન (Sandy)",
    cityLocation: "શહેર / જિલ્લો",
    cityPlaceholder: "દા.ત. રાજકોટ, સુરત, જૂનાગઢ, વડોદરા",
    season: "ઋતુ / મોસમ",
    selectSeason: "ઋતુ પસંદ કરો",
    seasonKharif: "ખરીફ (ચોમાસુ)",
    seasonRabi: "રવિ (શિયાળુ)",
    seasonZaid: "જાયદ (ઉનાળુ)",
    seasonSummer: "ઉનાળો",
    seasonMonsoon: "ચોમાસુ",
    seasonWinter: "શિયાળો",
    predictCropBtn: "શ્રેષ્ઠ પાકની ભલામણ મેળવો",
    predictingWait: "માહિતી ચકાસી રહ્યા છીએ...",

    plantDiagnosis: "છોડના રોગનું નિદાન",
    uploadPlantPhoto: "છોડ અથવા પાંદડાનો ફોટો અપલોડ કરો",
    uploadPlantDesc: "પાંદડાનો સ્પષ્ટ ફોટો પસંદ કરો",
    cropName: "પાકનું નામ",
    cropNamePlaceholder: "દા.ત. કપાસ, મગફળી, ઘઉં, બાજરી",
    diagnoseBtn: "રોગ ઓળખો અને દવા જાણો",

    checkWeatherCity: "જિલ્લો / શહેર",
    checkWeatherPlaceholder: "દા.ત. રાજકોટ",
    getWeatherBtn: "હવામાન તપાસો",

    searchStorePlaceholder: "ખાતર, બિયારણ, દવાની પંપ શોધો...",
    deliveryTime: "🌱 પ્રમાણિત કૃષિ ડિલિવરી",
    storeSubheader: "🌾 પ્રમાણિત બિયારણ, ખાતર અને સાધનો — સીધા તમારા ખેતરે",
    helpline: "📞 હેલ્પલાઇન: 1800-123-4567 (ટોલ ફ્રી)",
    cart: "કાર્ટ",
    cartEmpty: "તમારી કાર્ટ ખાલી છે",
    total: "કુલ રકમ",
    checkout: "ઓર્ડર પૂર્ણ કરો",
    addToCart: "કાર્ટમાં ઉમેરો",
    buyNow: "હમણાં ખરીદો",

    featCropRec: "પાક ભલામણ",
    featWeather: "હવામાન આગાહી",
    featAssistant: "AI ખેતી સહાયક",
    featAnalytics: "ફાર્મ એનાલિટિક્સ"
  },

  // 6. Bengali
  bn: {
    brandTitle: "কৃষি AI",
    brandSubtitle: "আপনার স্মার্ট কৃষি সহায়ক",
    farmManagement: "খামার ব্যবস্থাপনা",
    commerceAccount: "কেনাকাটা ও অ্যাকাউন্ট",
    langSelect: "ভাষা",
    signIn: "লগইন",
    signOut: "লগআউট",
    welcome: "স্বাগতম",
    farmer: "কৃষক বন্ধু",
    farmLead: "কৃষক / খামার প্রধান",
    home: "হোম",
    dashboard: "ড্যাশবোর্ড",
    agriStore: "কৃষি স্টোর",
    about: "আমাদের সম্পর্কে",
    contact: "যোগাযোগ",
    profile: "প্রোফাইল",
    settings: "সেটিংস",

    welcomeKrishi: "কৃষি AI-তে স্বাগতম",
    loginTagline: "আপনার স্মার্ট কৃষি সহায়ক",
    joinKrishi: "কৃষি AI-তে যোগ দিন",
    registerTagline: "স্মার্ট চাষাবাদের যাত্রা শুরু করুন",
    username: "ইউজারনেম",
    usernamePlaceholder: "আপনার ইউজারনেম লিখুন",
    usernameChoose: "ইউজারনেম নির্বাচন করুন",
    password: "পাসওয়ার্ড",
    passwordPlaceholder: "আপনার পাসওয়ার্ড লিখুন",
    passwordCreate: "একটি শক্তিশালী পাসওয়ার্ড তৈরি করুন",
    confirmPassword: "পাসওয়ার্ড নিশ্চিত করুন",
    confirmPasswordPlaceholder: "পাসওয়ার্ড পুনরায় লিখুন",
    agreeTerms: "আমি ব্যবহারের শর্তাবলী ও গোপনীয়তা নীতি মেনে নিচ্ছি",
    termsLink: "শর্তাবলী",
    privacyLink: "গোপনীয়তা নীতি",
    loginBtn: "খামারে প্রবেশ করুন (লগইন)",
    registerBtn: "নতুন অ্যাকাউন্ট খুলুন",
    newToKrishi: "কৃষি AI-তে নতুন?",
    createAccount: "অ্যাকাউন্ট তৈরি করুন",
    alreadyHaveAccount: "ইতিমধ্যে অ্যাকাউন্ট আছে?",
    loginHere: "এখানে লগইন করুন",
    passwordsDoNotMatch: "পাসওয়ার্ড মেলেনি!",
    passwordLengthWarn: "পাসওয়ার্ড অন্তত ৮ অক্ষরের হতে হবে!",
    loginSuccess: "লগইন সফল! ড্যাশবোর্ডে নেওয়া হচ্ছে...",
    registerSuccess: "নিবন্ধন সফল! লগইন পেজে নেওয়া হচ্ছে...",
    serverError: "সার্ভারে সংযোগে সমস্যা হচ্ছে।",

    dashTitle: "ড্যাশবোর্ড",
    dashSubtitle: "আপনার খামারের তথ্য ও স্বাস্থ্য পর্যালোচনা",
    cropRecTitle: "ফসলের সুপারিশ",
    cropRecSubtitle: "মাটি ও আবহাওয়া অনুযায়ী সেরা ফসল বেছে নিন",
    diseaseTitle: "রোগ নির্ণয় ও প্রতিকার",
    diseaseSubtitle: "ফসলের রোগ চিহ্নিত করুন ও সঠিক ওষুধ জানুন",
    assistantTitle: "AI কৃষি সহায়ক",
    assistantSubtitle: "বাংলায় কৃষি বিষয়ক যেকোনো পরামর্শ নিন",
    weatherTitle: "আবহাওয়ার খবর",
    weatherSubtitle: "স্থানীয় আবহাওয়া ও কৃষিকাজের প্রয়োজনীয় টিপস",
    ordersTitle: "আমার অর্ডার",
    ordersSubtitle: "ক্রয়কৃত কৃষি সামগ্রীর বিবরণ",
    profileTitle: "প্রোফাইল",
    profileSubtitle: "অ্যাকাউন্ট ও নিরাপত্তা সেটিংস",
    settingsTitle: "সেটিংস",
    settingsSubtitle: "ভাষা ও অ্যাপ পছন্দসমূহ",

    statCropsRecommended: "সুপারিশকৃত ফসল",
    statDiseasesIdentified: "শনাক্তকৃত রোগ",
    statWeatherStation: "আবহাওয়া স্টেশন",
    statDaysActive: "সক্রিয় দিন",
    weatherConnected: "সংযুক্ত",

    soilType: "মাটির ধরন",
    selectSoilType: "মাটির ধরন নির্বাচন করুন",
    soilAlluvial: "পলি মাটি (Alluvial)",
    soilBlack: "কালো মাটি (Black)",
    soilClay: "এঁটেল মাটি (Clay)",
    soilLoamy: "দোআঁশ মাটি (Loamy)",
    soilRed: "লাল মাটি (Red)",
    soilSandy: "বেলে মাটি (Sandy)",
    cityLocation: "শহর / জেলা",
    cityPlaceholder: "যেমন: বর্ধমান, নদীয়া, বাঁকুড়া",
    season: "মৌসুম / ঋতু",
    selectSeason: "মৌসুম নির্বাচন করুন",
    seasonKharif: "খরিফ (বর্ষাকাল)",
    seasonRabi: "রবি (শীতকাল)",
    seasonZaid: "জায়েদ (গ্রীষ্মকাল)",
    seasonSummer: "গ্রীষ্ম",
    seasonMonsoon: "বর্ষা",
    seasonWinter: "শীত",
    predictCropBtn: "উপযুক্ত ফসলের সুপারিশ দেখুন",
    predictingWait: "তথ্য বিশ্লেষণ করা হচ্ছে...",

    plantDiagnosis: "ফসলের রোগ নির্ণয়",
    uploadPlantPhoto: "আক্রান্ত পাতার ছবি আপলোড করুন",
    uploadPlantDesc: "পাতা বা কাণ্ডের পরিষ্কার ছবি দিন",
    cropName: "ফসলের নাম",
    cropNamePlaceholder: "যেমন: ধান, গম, আলু, পাট",
    diagnoseBtn: "রোগ শনাক্ত করুন ও প্রতিকার দেখুন",

    checkWeatherCity: "জেলা / শহর",
    checkWeatherPlaceholder: "যেমন: বর্ধমান",
    getWeatherBtn: "আবহাওয়া দেখুন",

    searchStorePlaceholder: "সার, বীজ, স্প্রেয়ার খুঁজুন...",
    deliveryTime: "🌱 সত্যায়িত কৃষি ডেলিভারি",
    storeSubheader: "🌾 সত্যায়িত বীজ, সার ও সরঞ্জাম — সরাসরি আপনার খামারে",
    helpline: "📞 হেল্পলাইন: ১৮০০-১২৩-৪৫৬৭ (টোল ফ্রি)",
    cart: "কার্ট",
    cartEmpty: "কার্ট খালি",
    total: "মোট টাকা",
    checkout: "অর্ডার সম্পন্ন করুন",
    addToCart: "কার্টে যোগ করুন",
    buyNow: "এখনই কিনুন",

    featCropRec: "ফসলের সুপারিশ",
    featWeather: "আবহাওয়ার খবর",
    featAssistant: "AI কৃষি সহায়ক",
    featAnalytics: "খামার বিশ্লেষণ"
  },

  // 7. Tamil
  ta: {
    brandTitle: "கிஷி AI",
    brandSubtitle: "உங்கள் ஸ்மார்ட் விவசாய உதவியாளர்",
    farmManagement: "பண்ணை மேலாண்மை",
    commerceAccount: "வணிகம் & கணக்கு",
    langSelect: "மொழி",
    signIn: "உள்நுழைக",
    signOut: "வெளியேறு",
    welcome: "வணக்கம்",
    farmer: "விவசாயி",
    farmLead: "விவசாயி / பண்ணைத் தலைவர்",
    home: "முகப்பு",
    dashboard: "டாஷ்போர்டு",
    agriStore: "விவசாய அங்காடி",
    about: "எங்களை பற்றி",
    contact: "தொடர்பு கொள்ள",
    profile: "சுயவிவரம்",
    settings: "அமைப்புகள்",

    welcomeKrishi: "கிஷி AI-க்கு நல்வரவு",
    loginTagline: "உங்கள் ஸ்மார்ட் விவசாய உதவியாளர்",
    joinKrishi: "கிஷி AI-ல் இணையுங்கள்",
    registerTagline: "நவீன விவசாயப் பயணத்தைத் தொடங்குங்கள்",
    username: "பயனர்பெயர் (Username)",
    usernamePlaceholder: "பயனர்பெயரை உள்ளிடவும்",
    usernameChoose: "பயனர்பெயரைத் தேர்ந்தெடுக்கவும்",
    password: "கடவுச்சொல் (Password)",
    passwordPlaceholder: "கடவுச்சொல்லை உள்ளிடவும்",
    passwordCreate: "வலுவான கடவுச்சொல்லை உருவாக்கவும்",
    confirmPassword: "கடவுச்சொல்லை உறுதிப்படுத்தவும்",
    confirmPasswordPlaceholder: "கடவுச்சொல்லை மீண்டும் உள்ளிடவும்",
    agreeTerms: "சேவை விதிமுறைகள் மற்றும் தனியுரிமைக் கொள்கையை ஏற்கிறேன்",
    termsLink: "விதிமுறைகள்",
    privacyLink: "தனியுரிமைக் கொள்கை",
    loginBtn: "பண்ணைக்குள் நுழையுங்கள் (Login)",
    registerBtn: "கணக்கை உருவாக்கவும்",
    newToKrishi: "கிஷி AI-க்கு புதியவரா?",
    createAccount: "புதிய கணக்கு தொடங்க",
    alreadyHaveAccount: "ஏற்கனவே கணக்கு உள்ளதா?",
    loginHere: "இங்கே உள்நுழையவும்",
    passwordsDoNotMatch: "கடவுச்சொற்கள் பொருந்தவில்லை!",
    passwordLengthWarn: "கடவுச்சொல் குறைந்தது 8 எழுத்துக்கள் இருக்க வேண்டும்!",
    loginSuccess: "உள்நுழைவு வெற்றிகரமானது! வழிநடத்துகிறது...",
    registerSuccess: "பதிவு வெற்றிகரமானது! உள்நுழைவுப் பக்கத்திற்குச் செல்கிறது...",
    serverError: "சேவையகத்துடன் இணைப்பதில் பிழை ஏற்பட்டது.",

    dashTitle: "டாஷ்போர்டு",
    dashSubtitle: "பண்ணை மேலோட்டம் மற்றும் ஆரோக்கிய விவரங்கள்",
    cropRecTitle: "பயிர் பரிந்துரை",
    cropRecSubtitle: "மண் மற்றும் வானிலைக்கேற்ற சிறந்த பயிர்களை அறியுங்கள்",
    diseaseTitle: "நோய் கண்டறிதல் & தீர்வுகள்",
    diseaseSubtitle: "பயிர் நோய்களைக் கண்டறிந்து தீர்வு பெறுங்கள்",
    assistantTitle: "AI விவசாய உதவியாளர்",
    assistantSubtitle: "விவசாய ஆலோசனைகளைத் தமிழில் உடனடியாகப் பெறுங்கள்",
    weatherTitle: "வானிலை முன்னறிவிப்பு",
    weatherSubtitle: "உள்ளூர் வானிலை மற்றும் விவசாயக் குறிப்புகள்",
    ordersTitle: "எனது ஆர்டர்கள்",
    ordersSubtitle: "வாங்கிய விவசாயப் பொருட்களின் விவரம்",
    profileTitle: "சுயவிவரம்",
    profileSubtitle: "கணக்கு மற்றும் பாதுகாப்பு அமைப்புகள்",
    settingsTitle: "அமைப்புகள்",
    settingsSubtitle: "மொழி மற்றும் பயன்பாட்டு விருப்பங்கள்",

    statCropsRecommended: "பரிந்துரைக்கப்பட்ட பயிர்கள்",
    statDiseasesIdentified: "கண்டறியப்பட்ட நோய்கள்",
    statWeatherStation: "வானிலை நிலையம்",
    statDaysActive: "செயலில் உள்ள நாட்கள்",
    weatherConnected: "இணைக்கப்பட்டது",

    soilType: "மண் வகை",
    selectSoilType: "மண் வகையைத் தேர்ந்தெடுக்கவும்",
    soilAlluvial: "வண்டல் மண் (Alluvial)",
    soilBlack: "கரிசல் மண் (Black Soil)",
    soilClay: "களிமண் (Clay)",
    soilLoamy: "வண்டல் கலந்த மண் (Loamy)",
    soilRed: "செம்மண் (Red Soil)",
    soilSandy: "மணல் மண் (Sandy)",
    cityLocation: "நகரம் / மாவட்டம்",
    cityPlaceholder: "எ.கா: மதுரை, தஞ்சாவூர், கோவை",
    season: "பருவம்",
    selectSeason: "பருவத்தைத் தேர்ந்தெடுக்கவும்",
    seasonKharif: "காரிஃப் (மழைக்காலம்)",
    seasonRabi: "ரபி (குளிர்காலம்)",
    seasonZaid: "சையத் (கோடைகாலம்)",
    seasonSummer: "கோடை",
    seasonMonsoon: "மழைக்காலம்",
    seasonWinter: "குளிர்காலம்",
    predictCropBtn: "சிறந்த பயிர்களை அறியவும்",
    predictingWait: "ஆய்வு செய்யப்படுகிறது...",

    plantDiagnosis: "பயிர் நோய் கண்டறிதல்",
    uploadPlantPhoto: "செடி / இலையின் புகைப்படத்தைப் பதிவேற்றவும்",
    uploadPlantDesc: "தெளிவான புகைப்படத்தைத் தேர்ந்தெடுக்கவும்",
    cropName: "பயிரின் பெயர்",
    cropNamePlaceholder: "எ.கா: நெல், பருத்தி, கரும்பு, மக்காச்சோளம்",
    diagnoseBtn: "நோயைக் கண்டறிந்து மருந்துகளை அறியவும்",

    checkWeatherCity: "மாவட்டம் / நகரம்",
    checkWeatherPlaceholder: "எ.கா: மதுரை",
    getWeatherBtn: "வானிலை பார்க்க",

    searchStorePlaceholder: "உரங்கள், விதைகள், தெளிப்பான்களைத் தேடுங்கள்...",
    deliveryTime: "🌱 சான்றளிக்கப்பட்ட வேளாண் விநியோகம்",
    storeSubheader: "🌾 சான்றளிக்கப்பட்ட விதைகள், உரங்கள் — நேரடியாக உங்கள் வயலுக்கு",
    helpline: "📞 உதவி எண்: 1800-123-4567 (கட்டணமில்லா)",
    cart: "கூடை (Cart)",
    cartEmpty: "கூடை காலியாக உள்ளது",
    total: "மொத்த தொகை",
    checkout: "ஆர்டர் செய்யவும்",
    addToCart: "கூடையில் சேர்க்க",
    buyNow: "இப்போதே வாங்க",

    featCropRec: "பயிர் பரிந்துரை",
    featWeather: "வானிலை விவரம்",
    featAssistant: "AI விவசாய ஆலோசகர்",
    featAnalytics: "பண்ணை புள்ளிവിவரம்"
  },

  // 8. Telugu
  te: {
    brandTitle: "కృషి AI",
    brandSubtitle: "మీ స్మార్ట్ వ్యవసాయ సహాయకుడు",
    farmManagement: "వ్యవసాయ నిర్వహణ",
    commerceAccount: "కొనుగోళ్లు & ఖాతా",
    langSelect: "భాష",
    signIn: "లాగిన్",
    signOut: "లాగ్ అవుట్",
    welcome: "స్వాగతం",
    farmer: "రైతు మిత్రుడు",
    farmLead: "రైతు / ఫార్మ్ లీడ్",
    home: "హోమ్",
    dashboard: "డ్యాష్‌బోర్డ్",
    agriStore: "అగ్రి స్టోర్",
    about: "మా గురించి",
    contact: "సంప్రదించండి",
    profile: "ప్రొఫైల్",
    settings: "సెట్టింగ్‌లు",

    welcomeKrishi: "కృషి AIకి స్వాగతం",
    loginTagline: "మీ స్మార్ట్ వ్యవసాయ సహాయకుడు",
    joinKrishi: "కృషి AIతో కలవండి",
    registerTagline: "ఆధునిక వ్యవసాయ ప్రయాణాన్ని ప్రారంభించండి",
    username: "యూజర్‌నేమ్",
    usernamePlaceholder: "మీ యూజర్‌నేమ్ నమోదు చేయండి",
    usernameChoose: "యూజర్‌నేమ్ ఎంచుకోండి",
    password: "పాస్‌వర్డ్",
    passwordPlaceholder: "మీ పాస్‌వర్డ్ నమోదు చేయండి",
    passwordCreate: "బలమైన పాస్‌వర్డ్ సృష్టించండి",
    confirmPassword: "పాస్‌వర్డ్ నిర్ధారించండి",
    confirmPasswordPlaceholder: "పాస్‌వర్డ్‌ను మళ్లీ నమోదు చేయండి",
    agreeTerms: "నేను సేవా నిబంధనలు మరియు గోప్యతా విధానాన్ని అంగీకరిస్తున్నాను",
    termsLink: "సేవా నిబంధనలు",
    privacyLink: "గోప్యతా విధానం",
    loginBtn: "పొలంలోకి ప్రవేశించండి (లాగిన్)",
    registerBtn: "ఖాతా సృష్టించండి",
    newToKrishi: "కృషి AIకి కొత్తవారా?",
    createAccount: "ఖాతా తెరవండి",
    alreadyHaveAccount: "ఇప్పటికే ఖాతా ఉందా?",
    loginHere: "ఇక్కడ లాగిన్ అవ్వండి",
    passwordsDoNotMatch: "పాస్‌వర్డ్‌లు సరిపోలడం లేదు!",
    passwordLengthWarn: "పాస్‌వర్డ్ కనీసం 8 అక్షరాలు ఉండాలి!",
    loginSuccess: "లాగిన్ విజయవంతమైంది! దారి చూపుతోంది...",
    registerSuccess: "రిజిస్ట్రేషన్ పూర్తయింది! లాగిన్ పేజీకి వెళ్తోంది...",
    serverError: "సర్వర్‌తో కనెక్ట్ కావడంలో లోపం.",

    dashTitle: "డ్యాష్‌బోర్డ్",
    dashSubtitle: "వ్యవసాయ సమాచారం మరియు ఆరోగ్య కొలమానాలు",
    cropRecTitle: "పంట సిఫార్సు",
    cropRecSubtitle: "నేల మరియు వాతావరణానికి అనువైన పంటలను ఎంచుకోండి",
    diseaseTitle: "తెగుళ్ల గుర్తింపు & నివారణ",
    diseaseSubtitle: "పంట తెగుళ్లను గుర్తించి సరైన మందులు తెలుసుకోండి",
    assistantTitle: "AI వ్యవసాయ సహాయకుడు",
    assistantSubtitle: "తెలుగులో వ్యవసాయ సలహాలు పొందండి",
    weatherTitle: "వాతావరణ సమాచారం",
    weatherSubtitle: "స్థానిక వాతావరణం మరియు వ్యవసాయ సూచనలు",
    ordersTitle: "నా ఆర్డర్లు",
    ordersSubtitle: "ఆర్డర్ వివరాలు మరియు స్థితి",
    profileTitle: "ప్రొఫైల్",
    profileSubtitle: "ఖాతా భద్రత మరియు వివరాలు",
    settingsTitle: "సెట్టింగ్‌లు",
    settingsSubtitle: "భాష మరియు యాప్ ప్రాధాన్యతలు",

    statCropsRecommended: "సిఫార్సు చేసిన పంటలు",
    statDiseasesIdentified: "గుర్తించిన తెగుళ్లు",
    statWeatherStation: "వాతావరణ కేంద్రం",
    statDaysActive: "క్రియాశీల రోజులు",
    weatherConnected: "కనెక్ట్ అయింది",

    soilType: "నేల రకం",
    selectSoilType: "నేల రకాన్ని ఎంచుకోండి",
    soilAlluvial: "ఒండ్రు నేల (Alluvial)",
    soilBlack: "నల్లరేగడి నేల (Black Soil)",
    soilClay: "బంకమన్ను నేల (Clay)",
    soilLoamy: "ఎర్ర/దుబ్బ నేల (Loamy)",
    soilRed: "ఎర్ర నేల (Red Soil)",
    soilSandy: "ఇసుక నేల (Sandy)",
    cityLocation: "నగరం / జిల్లా",
    cityPlaceholder: "ఉదా: గుంటూరు, వరంగల్, కర్నూలు",
    season: "సీజన్ / కాలం",
    selectSeason: "సీజన్ ఎంచుకోండి",
    seasonKharif: "ఖరీఫ్ (వర్షాకాలం)",
    seasonRabi: "రబీ (శీతాకాలం)",
    seasonZaid: "జాయెద్ (వేసవి కాలం)",
    seasonSummer: "వేసవి",
    seasonMonsoon: "వర్షాకాలం",
    seasonWinter: "శీతాకాలం",
    predictCropBtn: "మంచి పంట సిఫార్సులు పొందండి",
    predictingWait: "వివరాలను విశ్లేషిస్తున్నాము...",

    plantDiagnosis: "పంట తెగులు నిర్ధారణ",
    uploadPlantPhoto: "మొక్క / ఆకు ఫోటోను అప్‌లోడ్ చేయండి",
    uploadPlantDesc: "స్పష్టమైన ఫోటోను ఎంచుకోండి",
    cropName: "పంట పేరు",
    cropNamePlaceholder: "ఉదా: వరి, పత్తి, మిరప, మొక్కజొన్న",
    diagnoseBtn: "తెగులు గుర్తించి మందులు చూడండి",

    checkWeatherCity: "జిల్లా / నగరం",
    checkWeatherPlaceholder: "ఉదా: గుంటూరు",
    getWeatherBtn: "వాతావరణం చూడండి",

    searchStorePlaceholder: "ఎరువులు, విత్తనాలు, స్ప్రేయర్లు వెతకండి...",
    deliveryTime: "🌱 ధృవీకృత వ్యవసాయ డెలివరీ",
    storeSubheader: "🌾 ధృవీకృత విత్తనాలు, ఎరువులు — నేరుగా మీ పొలానికి",
    helpline: "📞 హెల్ప్‌లైన్: 1800-123-4567 (ఉచితం)",
    cart: "కార్ట్",
    cartEmpty: "కార్ట్ ఖాళీగా ఉంది",
    total: "మొత్తం ధర",
    checkout: "ఆర్డర్ చేయండి",
    addToCart: "కార్ట్‌కు జోడించండి",
    buyNow: "ఇప్పుడే కొనండి",

    featCropRec: "పంట సిఫార్సు",
    featWeather: "వాతావరణ సూచన",
    featAssistant: "AI వ్యవసాయ మిత్రుడు",
    featAnalytics: "వ్యవసాయ విశ్లేషణ"
  },

  // 9. Kannada
  kn: {
    brandTitle: "ಕೃಷಿ AI",
    brandSubtitle: "ನಿಮ್ಮ ಸ್ಮಾರ್ಟ್ ಕೃಷಿ ಸಹಾಯಕ",
    farmManagement: "ಕೃಷಿ ನಿರ್ವಹಣೆ",
    commerceAccount: "ಖರೀದಿ ಮತ್ತು ಖಾತೆ",
    langSelect: "ಭಾಷೆ",
    signIn: "ಲಾಗಿನ್",
    signOut: "ಸೈನ್ ಔಟ್",
    welcome: "ಸ್ವಾಗತ",
    farmer: "ರೈತ ಮಿತ್ರ",
    farmLead: "ರೈತ / ಕೃಷಿ ಮುಖ್ಯಸ್ಥ",
    home: "ಮುಖಪುಟ",
    dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    agriStore: "ಕೃಷಿ ಸ್ಟೋರ್",
    about: "ನಮ್ಮ ಬಗ್ಗೆ",
    contact: "ಸಂಪರ್ಕಿಸಿ",
    profile: "ಪ್ರೊಫೈಲ್",
    settings: "ಸೆಟ್ಟಿಂಗ್ಸ್",

    welcomeKrishi: "ಕೃಷಿ AI ಗೆ ಸುಸ್ವಾಗತ",
    loginTagline: "ನಿಮ್ಮ ಸ್ಮಾರ್ಟ್ ಕೃಷಿ ಸಹಾಯಕ",
    joinKrishi: "ಕೃಷಿ AI ಗೆ ಸೇರಿ",
    registerTagline: "ನಿಮ್ಮ ಆಧುನಿಕ ಕೃಷಿ ಪಯಣ ಆರಂಭಿಸಿ",
    username: "ಬಳಕೆದಾರ ಹೆಸರು",
    usernamePlaceholder: "ಬಳಕೆದಾರ ಹೆಸರು ನಮೂದಿಸಿ",
    usernameChoose: "ಬಳಕೆದಾರ ಹೆಸರು ಆಯ್ಕೆಮಾಡಿ",
    password: "ಪಾಸ್‌ವರ್ಡ್",
    passwordPlaceholder: "ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ",
    passwordCreate: "ಬಲವಾದ ಪಾಸ್‌ವರ್ಡ್ ರಚಿಸಿ",
    confirmPassword: "ಪಾಸ್‌ವರ್ಡ್ ದೃಢೀಕರಿಸಿ",
    confirmPasswordPlaceholder: "ಪಾಸ್‌ವರ್ಡ್ ಪುನಃ ನಮೂದಿಸಿ",
    agreeTerms: "ನಾನು ಸೇವಾ ನಿಯಮಗಳು ಮತ್ತು ಗೌಪ್ಯತೆ ನೀತಿಗೆ ಒಪ್ಪುತ್ತೇನೆ",
    termsLink: "ನಿಯಮಗಳು",
    privacyLink: "ಗೌಪ್ಯತೆ ನೀತಿ",
    loginBtn: "ಕೃಷಿ ಜಾಲಕ್ಕೆ ಪ್ರವೇಶಿಸಿ (ಲಾಗಿನ್)",
    registerBtn: "ಖಾತೆ ತೆರೆಯಿರಿ",
    newToKrishi: "ಕೃಷಿ AI ಗೆ ಹೊಸಬರೆ?",
    createAccount: "ಹೊಸ ಖಾತೆ ರಚಿಸಿ",
    alreadyHaveAccount: "ಈಗಾಗಲೇ ಖಾತೆ ಇದೆಯೇ?",
    loginHere: "ಇಲ್ಲಿ ಲಾಗಿನ್ ಆಗಿ",
    passwordsDoNotMatch: "ಪಾಸ್‌ವರ್ಡ್‌ಗಳು ಹೊಂದಿಕೆಯಾಗುತ್ತಿಲ್ಲ!",
    passwordLengthWarn: "ಪಾಸ್‌ವರ್ಡ್ ಕನಿಷ್ಠ 8 ಅಕ್ಷರಗಳಾಗಿರಬೇಕು!",
    loginSuccess: "ಲಾಗಿನ್ ಯಶಸ್ವಿಯಾಗಿದೆ! ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ತೆರೆಯಲಾಗುತ್ತಿದೆ...",
    registerSuccess: "ನೋಂದಣಿ ಯಶಸ್ವಿಯಾಗಿದೆ! ಲಾಗಿನ್ ಪುಟಕ್ಕೆ ಕರೆದೊಯ್ಯಲಾಗುತ್ತಿದೆ...",
    serverError: "ಸರ್ವರ್ ಸಂಪರ್ಕದಲ್ಲಿ ದೋಷವಾಗಿದೆ.",

    dashTitle: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    dashSubtitle: "ಕೃಷಿ ಸಮಗ್ರ ಮಾಹಿತಿ ಮತ್ತು ಬೆಳವಣಿಗೆಯ ವಿವರ",
    cropRecTitle: "ಬೆಳೆ ಶಿಫಾರಸು",
    cropRecSubtitle: "ಮಣ್ಣು ಮತ್ತು ಹವಾಮಾನಕ್ಕೆ ಸೂಕ್ತವಾದ ಬೆಳೆಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    diseaseTitle: "ರೋಗ ಪತ್ತೆ ಮತ್ತು ಪರಿಹಾರ",
    diseaseSubtitle: "ಬೆಳೆ ರೋಗಗಳನ್ನು ಪತ್ತೆಹಚ್ಚಿ ಪರಿಹಾರ ಕಂಡುಕೊಳ್ಳಿ",
    assistantTitle: "AI ಕೃಷಿ ಸಹಾಯಕ",
    assistantSubtitle: "ಕನ್ನಡದಲ್ಲೇ ಕೃಷಿ ಸಲಹೆಗಳನ್ನು ಪಡೆಯಿರಿ",
    weatherTitle: "ಹವಾಮಾನ ಮಾಹಿತಿ",
    weatherSubtitle: "ಸ್ಥಳೀಯ ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ ಮತ್ತು ಕೃಷಿ ಸಲಹೆಗಳು",
    ordersTitle: "ನನ್ನ ಆರ್ಡರ್‌ಗಳು",
    ordersSubtitle: "ಖರೀದಿಸಿದ ಕೃಷಿ ಪರಿಕರಗಳ ವಿವರ",
    profileTitle: "ಪ್ರೊಫೈಲ್",
    profileSubtitle: "ಖಾತೆ ಮತ್ತು ಭದ್ರತಾ ಮಾಹಿತಿ",
    settingsTitle: "ಸೆಟ್ಟಿಂಗ್ಸ್",
    settingsSubtitle: "ಭಾಷೆ ಮತ್ತು ಆದ್ಯತೆಗಳನ್ನು ಬದಲಾಯಿಸಿ",

    statCropsRecommended: "ಶಿಫಾರಸು ಮಾಡಿದ ಬೆಳೆಗಳು",
    statDiseasesIdentified: "ಪತ್ತೆಯಾದ ರೋಗಗಳು",
    statWeatherStation: "ಹವಾಮಾನ ಕೇಂದ್ರ",
    statDaysActive: "ಸಕ್ರಿಯ ದಿನಗಳು",
    weatherConnected: "ಸಂಪರ್ಕಗೊಂಡಿದೆ",

    soilType: "ಮಣ್ಣಿನ ವಿಧ",
    selectSoilType: "ಮಣ್ಣಿನ ವಿಧವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    soilAlluvial: "ಮೆಕ್ಕಲು ಮಣ್ಣು (Alluvial)",
    soilBlack: "ಕಪ್ಪು ಮಣ್ಣು (Black Soil)",
    soilClay: "ಜೇಡಿ ಮಣ್ಣು (Clay)",
    soilLoamy: "ಗೋಡು ಮಣ್ಣು (Loamy)",
    soilRed: "ಕೆಂಪು ಮಣ್ಣು (Red Soil)",
    soilSandy: "ಮರಳು ಮಣ್ಣು (Sandy)",
    cityLocation: "ನಗರ / ಜಿಲ್ಲೆ",
    cityPlaceholder: "ಉದಾ: ಶಿವಮೊಗ್ಗ, ಧಾರವಾಡ, ಮೈಸೂರು",
    season: "ಋತು / ಹಂಗಾಮು",
    selectSeason: "ಋತುವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    seasonKharif: "ಮುಂಗಾರು (Kharif)",
    seasonRabi: "ಹಿಂಗಾರು (Rabi)",
    seasonZaid: "ಬೇಸಿಗೆ (Zaid)",
    seasonSummer: "ಬೇಸಿಗೆ ಕಾಲ",
    seasonMonsoon: "ಮಳೆಗಾಲ",
    seasonWinter: "ಚಳಿಗಾಲ",
    predictCropBtn: "ಉತ್ತಮ ಬೆಳೆಗಳ ಶಿಫಾರಸು ಪಡೆಯಿರಿ",
    predictingWait: "ವಿಶ್ಲೇಷಣೆ ನಡೆಸಲಾಗುತ್ತಿದೆ...",

    plantDiagnosis: "ಗಿಡದ ರೋಗ ಪತ್ತೆ",
    uploadPlantPhoto: "ಗಿಡ ಅಥವಾ ಎಲೆಯ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
    uploadPlantDesc: "ಸ್ಪಷ್ಟವಾದ ಫೋಟೋವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    cropName: "ಬೆಳೆಯ ಹೆಸರು",
    cropNamePlaceholder: "ಉದಾ: ಭತ್ತ, ಜೋಳ, ಹತ್ತಿ, ಕಬ್ಬು",
    diagnoseBtn: "ರೋಗ ಪತ್ತೆಮಾಡಿ ಔಷಧಿ ತಿಳಿಯಿರಿ",

    checkWeatherCity: "ಜಿಲ್ಲೆ / ನಗರ",
    checkWeatherPlaceholder: "ಉದಾ: ಧಾರವಾಡ",
    getWeatherBtn: "ಹವಾಮಾನ ಪರಿಶೀಲಿಸಿ",

    searchStorePlaceholder: "ಗೊಬ್ಬರ, ಬೀಜಗಳು, ಔಷಧ ಸಿಂಪಡಕ ಹುಡುಕಿ...",
    deliveryTime: "🌱 ಪ್ರಮಾಣೀಕೃತ ಕೃಷಿ ವಿತರಣೆ",
    storeSubheader: "🌾 ಪ್ರಮಾಣೀಕೃತ ಬೀಜಗಳು, ಗೊಬ್ಬರ — ನೇರವಾಗಿ ನಿಮ್ಮ ಹೊಲಕ್ಕೆ",
    helpline: "📞 ಸಹಾಯವಾಣಿ: 1800-123-4567 (ಉಚಿತ)",
    cart: "ಕಾರ್ಟ್",
    cartEmpty: "ಕಾರ್ಟ್ ಖಾಲಿಯಾಗಿದೆ",
    total: "ಒಟ್ಟು ಮೊತ್ತ",
    checkout: "ಖರೀದಿ ಪೂರ್ಣಗೊಳಿಸಿ",
    addToCart: "ಕಾರ್ಟ್‌ಗೆ ಸೇರಿಸಿ",
    buyNow: "ಈಗಲೇ ಖರೀದಿಸಿ",

    featCropRec: "ಬೆಳೆ ಶಿಫಾರಸು",
    featWeather: "ಹವಾಮಾನ ಮಾಹಿತಿ",
    featAssistant: "AI ಕೃಷಿ ಸಹಾಯಕ",
    featAnalytics: "ಕೃಷಿ ವಿಶ್ಲೇಷಣೆ"
  },

  // 10. Malayalam
  ml: {
    brandTitle: "കൃഷി AI",
    brandSubtitle: "നിങ്ങളുടെ സ്മാർട്ട് കൃഷി സഹായി",
    farmManagement: "കൃഷി പരിപാലനം",
    commerceAccount: "വ്യാപാരം & അക്കൗണ്ട്",
    langSelect: "ഭാഷ",
    signIn: "ലോഗിൻ",
    signOut: "സൈൻ ഔട്ട്",
    welcome: "സ്വാഗതം",
    farmer: "കർഷകൻ",
    farmLead: "കർഷകൻ / ഫാം ലീഡ്",
    home: "ഹോം",
    dashboard: "ഡാഷ്‌ബോർഡ്",
    agriStore: "അഗ്രി സ്റ്റോർ",
    about: "ഞങ്ങളെക്കുറിച്ച്",
    contact: "ബന്ധപ്പെടുക",
    profile: "പ്രൊഫൈൽ",
    settings: "ക്രമീകരണങ്ങൾ",

    welcomeKrishi: "കൃഷി AI-ലേക്ക് സ്വാഗതം",
    loginTagline: "നിങ്ങളുടെ സ്മാർട്ട് കൃഷി സഹായി",
    joinKrishi: "കൃഷി AI-ൽ ചേരൂ",
    registerTagline: "നിങ്ങളുടെ ആധുനിക കാർഷിക യാത്ര ആരംഭിക്കൂ",
    username: "ഉപയോക്തൃനാമം",
    usernamePlaceholder: "യൂസർനെയിം നൽകുക",
    usernameChoose: "യൂസർനെയിം തിരഞ്ഞെടുക്കുക",
    password: "പാസ്‌വേഡ്",
    passwordPlaceholder: "പാസ്‌വേഡ് നൽകുക",
    passwordCreate: "ശക്തമായ പാസ്‌വേഡ് ഉണ്ടാക്കുക",
    confirmPassword: "പാസ്‌വേഡ് സ്ഥിരീകരിക്കുക",
    confirmPasswordPlaceholder: "പാസ്‌വേഡ് വീണ്ടും നൽകുക",
    agreeTerms: "ഞാൻ സേവന നിബന്ധനകളും സ്വകാര്യതാ നയവും അംഗീകരിക്കുന്നു",
    termsLink: "നിബന്ധനകൾ",
    privacyLink: "സ്വകാര്യതാ നയം",
    loginBtn: "ഫാമിലേക്ക് പ്രവേശിക്കുക (ലോഗിൻ)",
    registerBtn: "അക്കൗണ്ട് തുടങ്ങുക",
    newToKrishi: "കൃഷി AI-ൽ പുതിയ ആളാണോ?",
    createAccount: "പുതിയ അക്കൗണ്ട് ഉണ്ടാക്കുക",
    alreadyHaveAccount: "മുമ്പ് അക്കൗണ്ട് ഉണ്ടോ?",
    loginHere: "ഇവിടെ ലോഗിൻ ചെയ്യുക",
    passwordsDoNotMatch: "പാസ്‌വേഡുകൾ പൊരുത്തപ്പെടുന്നില്ല!",
    passwordLengthWarn: "പാസ്‌വേഡിന് കുറഞ്ഞത് 8 അക്ഷരങ്ങൾ വേണം!",
    loginSuccess: "ലോഗിൻ വിജയിച്ചു! ഡാഷ്‌ബോർഡിലേക്ക് പോകുന്നു...",
    registerSuccess: "രജിസ്ട്രേഷൻ വിജയിച്ചു! ലോഗിൻ പേജിലേക്ക് പോകുന്നു...",
    serverError: "സെർവറുമായി ബന്ധപ്പെടാൻ കഴിഞ്ഞില്ല.",

    dashTitle: "ഡാഷ്‌ബോർഡ്",
    dashSubtitle: "കൃഷിയിട അവലോകനവും ആരോഗ്യ വിവരങ്ങളും",
    cropRecTitle: "വിള നിർദ്ദേശം",
    cropRecSubtitle: "മണ്ണിനും കാലാവസ്ഥയ്ക്കും അനുയോജ്യമായ വിളകൾ തിരഞ്ഞെടുക്കൂ",
    diseaseTitle: "രോഗനിർണയം & പരിഹാരം",
    diseaseSubtitle: "വിള രോഗങ്ങൾ തിരിച്ചറിഞ്ഞ് ശരിയായ പരിഹാരം നേടൂ",
    assistantTitle: "AI കൃഷി സഹായി",
    assistantSubtitle: "മലയാളത്തിൽ കാർഷിക ഉപദേശങ്ങൾ നേടൂ",
    weatherTitle: "കാലാവസ്ഥ വിവരങ്ങൾ",
    weatherSubtitle: "പ്രാദേശിക കാലാവസ്ഥയും കർഷക നിർദ്ദേശങ്ങളും",
    ordersTitle: "എന്റെ ഓർഡറുകൾ",
    ordersSubtitle: "വാങ്ങിയ ഉൽപ്പന്നങ്ങളുടെ വിവരങ്ങൾ",
    profileTitle: "പ്രൊഫൈൽ",
    profileSubtitle: "അക്കൗണ്ട് സുരക്ഷയും വിവരങ്ങളും",
    settingsTitle: "ക്രമീകരണങ്ങൾ",
    settingsSubtitle: "ഭാഷയും ആപ്പ് മുൻഗണനകളും മാറ്റുക",

    statCropsRecommended: "നിർദ്ദേശിച്ച വിളകൾ",
    statDiseasesIdentified: "കണ്ടെത്തിയ രോഗങ്ങൾ",
    statWeatherStation: "കാലാവസ്ഥാ കേന്ദ്രം",
    statDaysActive: "പ്രവർത്തന ദിവസങ്ങൾ",
    weatherConnected: "കണക്റ്റുചെയ്‌തു",

    soilType: "മണ്ണിന്റെ തരം",
    selectSoilType: "മണ്ണിന്റെ തരം തിരഞ്ഞെടുക്കുക",
    soilAlluvial: "എക്കൽ മണ്ണ് (Alluvial)",
    soilBlack: "കരിമണ്ണ് (Black Soil)",
    soilClay: "കളിമണ്ണ് (Clay)",
    soilLoamy: "പശിമരാശി മണ്ണ് (Loamy)",
    soilRed: "ചെമ്മണ്ണ് (Red Soil)",
    soilSandy: "മണൽ മണ്ണ് (Sandy)",
    cityLocation: "നഗരം / ജില്ല",
    cityPlaceholder: "ഉദാ: പാലക്കാട്, വയനാട്, കോട്ടയം",
    season: "സീസൺ / കാലം",
    selectSeason: "കാലം തിരഞ്ഞെടുക്കുക",
    seasonKharif: "ഖാരിഫ് (മഴക്കാലം)",
    seasonRabi: "റാബി (ശീതകാലം)",
    seasonZaid: "സെയ്ദ് (വേനൽക്കാലം)",
    seasonSummer: "വേനൽക്കാലം",
    seasonMonsoon: "മഴക്കാലം",
    seasonWinter: "ശീതകാലം",
    predictCropBtn: "മികച്ച വിളകളുടെ നിർദ്ദേശം നേടൂ",
    predictingWait: "വിവരങ്ങൾ പരിശോധിക്കുന്നു...",

    plantDiagnosis: "വിള രോഗനിർണയം",
    uploadPlantPhoto: "ചെടിയുടെ / ഇലയുടെ ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക",
    uploadPlantDesc: "വ്യക്തമായ ഫോട്ടോ തിരഞ്ഞെടുക്കുക",
    cropName: "വിളയുടെ പേര്",
    cropNamePlaceholder: "ഉദാ: നെല്ല്, വാഴ, തെങ്ങ്, കുരുമുളക്",
    diagnoseBtn: "രോഗം കണ്ടെത്തി മരുന്ന് അറിയുക",

    checkWeatherCity: "ജില്ല / നഗരം",
    checkWeatherPlaceholder: "ഉദാ: പാലക്കാട്",
    getWeatherBtn: "കാലാവസ്ഥ പരിശോധിക്കുക",

    searchStorePlaceholder: "വളം, വിത്ത്, സ്പ്രേയർ തിരയുക...",
    deliveryTime: "🌱 സാക്ഷ്യപ്പെടുത്തിയ കൃഷി ഡെലിവറി",
    storeSubheader: "🌾 സാക്ഷ്യപ്പെടുത്തിയ വിത്തുകൾ, വളം — നേരിട്ട് നിങ്ങളുടെ പാടത്ത്",
    helpline: "📞 ഹെൽപ്പ്‌ലൈൻ: 1800-123-4567 (ടോൾ ഫ്രീ)",
    cart: "കാർട്ട്",
    cartEmpty: "കാർട്ട് ശൂന്യമാണ്",
    total: "ആകെ തുക",
    checkout: "ഓർഡർ ചെയ്യുക",
    addToCart: "കാർട്ടിലേക്ക് ചേർക്കുക",
    buyNow: "ഇപ്പോൾ വാങ്ങുക",

    featCropRec: "വിള നിർദ്ദേശം",
    featWeather: "കാലാവസ്ഥാ മുന്നറിയിപ്പ്",
    featAssistant: "AI കൃഷി ഉപദേശകൻ",
    featAnalytics: "ഫാം അനലിറ്റിക്സ്"
  },

  // 11. Odia
  or: {
    brandTitle: "କୃଷି AI",
    brandSubtitle: "ଆପଣଙ୍କ ସ୍ମାର୍ଟ କୃଷି ସହାୟକ",
    farmManagement: "କୃଷି ପରିଚାଳନା",
    commerceAccount: "କିଣାବିକା ଏବଂ ଖାତା",
    langSelect: "ଭାଷା",
    signIn: "ଲଗଇନ୍",
    signOut: "ଲଗ୍ ଆଉଟ୍",
    welcome: "ସ୍ୱାଗତ",
    farmer: "ଚାଷୀ ଭାଇ",
    farmLead: "କୃଷକ / ଫାର୍ମ ଲିଡ୍",
    home: "ମୁଖ୍ୟ ପୃଷ୍ଠା",
    dashboard: "ଡ୍ୟାସବୋର୍ଡ",
    agriStore: "କୃଷି ଷ୍ଟୋର୍",
    about: "ଆମ ବିଷୟରେ",
    contact: "ଯୋଗାଯୋଗ",
    profile: "ପ୍ରୋଫାଇଲ୍",
    settings: "ସେଟିଙ୍ଗ୍ସ",

    welcomeKrishi: "କୃଷି AI କୁ ସ୍ୱାଗତ",
    loginTagline: "ଆପଣଙ୍କ ସ୍ମାର୍ଟ କୃଷି ସହାୟକ",
    joinKrishi: "କୃଷି AI ରେ ଯୋଗ ଦିଅନ୍ତୁ",
    registerTagline: "ଆଧୁନିକ ଚାଷର ଯାତ୍ରା ଆରମ୍ଭ କରନ୍ତୁ",
    username: "ୟୁଜରନେମ୍",
    usernamePlaceholder: "ୟୁଜରନେମ୍ ପ୍ରବେଶ କରନ୍ତୁ",
    usernameChoose: "ୟୁଜରନେମ୍ ବାଛନ୍ତୁ",
    password: "ପାସୱାର୍ଡ",
    passwordPlaceholder: "ପାସୱାର୍ଡ ପ୍ରବେଶ କରନ୍ତୁ",
    passwordCreate: "ଦୃଢ଼ ପାସୱାର୍ଡ ତିଆରି କରନ୍ତୁ",
    confirmPassword: "ପାସୱାର୍ଡ ନିଶ୍ଚିତ କରନ୍ତୁ",
    confirmPasswordPlaceholder: "ପାସୱାର୍ଡ ପୁନଃ ପ୍ରବେଶ କରନ୍ତୁ",
    agreeTerms: "ମୁଁ ସେବା ନିୟମାବଳୀ ଓ ଗୋପନୀୟତା ନୀତି ସହ ସହମତ",
    termsLink: "ସେବା ନିୟମାବଳୀ",
    privacyLink: "ଗୋପନୀୟତା ନୀତି",
    loginBtn: "ଖମାରରେ ପ୍ରବେଶ କରନ୍ତୁ (ଲଗଇନ୍)",
    registerBtn: "ନୂଆ ଖାତା ଖୋଲନ୍ତୁ",
    newToKrishi: "କୃଷି AI ରେ ନୂଆ ଅଛନ୍ତି କି?",
    createAccount: "ଖାତା ତିଆରି କରନ୍ତୁ",
    alreadyHaveAccount: "ପୂର୍ବରୁ ଖାତା ଅଛି କି?",
    loginHere: "ଏଠାରେ ଲଗଇନ୍ କରନ୍ତୁ",
    passwordsDoNotMatch: "ପାସୱାର୍ଡ ମେଳ ଖାଉନାହିଁ!",
    passwordLengthWarn: "ପାସୱାର୍ଡ ଅତିକମରେ ୮ଟି ଅକ୍ଷର ହେବା ଆବଶ୍ୟକ!",
    loginSuccess: "ଲଗଇନ୍ ସଫଳ! ଡ୍ୟାସବୋର୍ଡକୁ ଯାଉଛି...",
    registerSuccess: "ପଞ୍ଜୀକରଣ ସଫଳ! ଲଗଇନ୍ ପୃଷ୍ଠାକୁ ଯାଉଛି...",
    serverError: "ସର୍ଭର ସହିତ ସଂଯୋଗ ହୋଇପାରିଲା ନାହିଁ।",

    dashTitle: "ଡ୍ୟାସବୋର୍ଡ",
    dashSubtitle: "ଆପଣଙ୍କ ଚାଷର ସମ୍ପୂର୍ଣ୍ଣ ବିବରଣୀ ଏବଂ ସ୍ୱାସ୍ଥ୍ୟ",
    cropRecTitle: "ଫସଲ ସୁପାରିଶ",
    cropRecSubtitle: "ମାଟି ଏବଂ ପାଣିପାଗ ଅନୁଯାୟୀ ଉପଯୁକ୍ତ ଫସଲ ବାଛନ୍ତୁ",
    diseaseTitle: "ରୋଗ ଚିହ୍ନଟ ଓ ପ୍ରତିକାର",
    diseaseSubtitle: "ଫସଲର ରୋଗ ଚିହ୍ନଟ କରନ୍ତୁ ଏବଂ ଉପଶମ ଜାଣନ୍ତୁ",
    assistantTitle: "AI କୃଷି ସହାୟକ",
    assistantSubtitle: "ଓଡ଼ିଆରେ କୃଷି ପରାମର୍ଶ ପାଆନ୍ତୁ",
    weatherTitle: "ପାଣିପାଗ ସୂଚନା",
    weatherSubtitle: "ସ୍ଥାନୀୟ ପାଣିପାଗ ଏବଂ ଚାଷ ପାଇଁ ଟିପ୍ସ",
    ordersTitle: "ମୋର ଅର୍ଡର",
    ordersSubtitle: "କିଣାଯାଇଥିବା ସାମଗ୍ରୀର ବିବରଣୀ",
    profileTitle: "ପ୍ରୋଫାଇଲ୍",
    profileSubtitle: "ଖାତା ଏବଂ ସୁରକ୍ଷା ପରିଚାଳନା",
    settingsTitle: "ସେଟିଙ୍ଗ୍ସ",
    settingsSubtitle: "ଭାଷା ଏବଂ ଆପ୍ ପସନ୍ଦ ପରିବର୍ତ୍ତନ କରନ୍ତୁ",

    statCropsRecommended: "ସୁପାରିଶ ଫସଲ",
    statDiseasesIdentified: "ଚିହ୍ନଟ ରୋଗ",
    statWeatherStation: "ପାଣିପାଗ କେନ୍ଦ୍ର",
    statDaysActive: "ସକ୍ରିୟ ଦିନ",
    weatherConnected: "ସଂଯୁକ୍ତ",

    soilType: "ମାଟିର ପ୍ରକାର",
    selectSoilType: "ମାଟିର ପ୍ରକାର ବାଛନ୍ତୁ",
    soilAlluvial: "ପଟୁ ମାଟି (Alluvial)",
    soilBlack: "କଳା ମାଟି (Black Soil)",
    soilClay: "ମଟାଳ ମାଟି (Clay)",
    soilLoamy: "ଦୋରସା ମାଟି (Loamy)",
    soilRed: "ଲାଲ ମାଟି (Red Soil)",
    soilSandy: "ବାଲିଆ ମାଟି (Sandy)",
    cityLocation: "ସହର / ଜିଲ୍ଲା",
    cityPlaceholder: "ଯଥା: କଟକ, ସମ୍ବଲପୁର, ବାଲେଶ୍ୱର",
    season: "ଋତୁ",
    selectSeason: "ଋତୁ ବାଛନ୍ତୁ",
    seasonKharif: "ଖରିଫ (ବର୍ଷା ଦିନ)",
    seasonRabi: "ରବି (ଶୀତ ଦିନ)",
    seasonZaid: "ଜାଏଦ (ଖରା ଦିନ)",
    seasonSummer: "ଖରା ଦିନ",
    seasonMonsoon: "ବର୍ଷା ଦିନ",
    seasonWinter: "ଶୀତ ଦିନ",
    predictCropBtn: "ସର୍ବୋତ୍ତମ ଫସଲ ସୁପାରିଶ ପାଆନ୍ତୁ",
    predictingWait: "ତଥ୍ୟ ବିଶ୍ଳେଷଣ କରାଯାଉଛି...",

    plantDiagnosis: "ଫସଲ ରୋଗ ନିର୍ଣ୍ଣୟ",
    uploadPlantPhoto: "ଗଛ କିମ୍ବା ପତ୍ରର ଫଟୋ ଅପଲୋଡ୍ କରନ୍ତୁ",
    uploadPlantDesc: "ପରିଷ୍କାର ଫଟୋ ବାଛନ୍ତୁ",
    cropName: "ଫସଲର ନାମ",
    cropNamePlaceholder: "ଯଥା: ଧାନ, ଗହମ, କପା, ମକା",
    diagnoseBtn: "ରୋଗ ଚିହ୍ନଟ କରନ୍ତୁ ଓ ପ୍ରତିକାର ଦେଖନ୍ତୁ",

    checkWeatherCity: "ଜିଲ୍ଲା / ସହର",
    checkWeatherPlaceholder: "ଯଥା: କଟକ",
    getWeatherBtn: "ପାଣିପାଗ ଦେଖନ୍ତୁ",

    searchStorePlaceholder: "ଖତ, ବିହନ, କୀଟନାଶକ ଖୋଜନ୍ତୁ...",
    deliveryTime: "🌱 ପ୍ରମାଣିତ କୃଷି ଡେଲିଭରୀ",
    storeSubheader: "🌾 ପ୍ରମାଣିତ ବିହନ, ଖତ ଓ ଯନ୍ତ୍ର — ସିଧା ଆପଣଙ୍କ ବିଲକୁ",
    helpline: "📞 ହେଲ୍ପଲାଇନ୍: ୧୮୦୦-୧୨୩-୪୫୬୭ (ନିଃଶୁଳ୍କ)",
    cart: "କାର୍ଟ",
    cartEmpty: "କାର୍ଟ ଖାଲି ଅଛି",
    total: "ମୋଟ ଟଙ୍କା",
    checkout: "ଅର୍ଡର କରନ୍ତୁ",
    addToCart: "କାର୍ଟରେ ଯୋଡନ୍ତୁ",
    buyNow: "ବର୍ତ୍ତମାନ କିଣନ୍ତୁ",

    featCropRec: "ଫସଲ ସୁପାରିଶ",
    featWeather: "ପାଣିପାଗ ସୂଚନା",
    featAssistant: "AI କୃଷି ସହାୟକ",
    featAnalytics: "ଫାର୍ମ ବିଶ୍ଳେଷଣ"
  }
};

/**
 * i18n Core Helper Functions
 */
class KrishiI18n {
  constructor() {
    // Default language is Hindi ('hi') - best suited for Indian farmers, fallback to 'en'
    this.currentLang = localStorage.getItem('krishi_lang') || 'hi';
    this.subscribers = [];
  }

  getLanguage() {
    return this.currentLang;
  }

  setLanguage(langCode) {
    if (!KRISHI_TRANSLATIONS[langCode]) {
      console.warn(`[i18n] Language ${langCode} not found, defaulting to 'hi'`);
      langCode = 'hi';
    }
    this.currentLang = langCode;
    localStorage.setItem('krishi_lang', langCode);
    document.documentElement.lang = langCode;

    // Apply translations across current document
    this.translatePage();

    // Trigger subscribers
    this.subscribers.forEach(cb => cb(langCode));
  }

  t(key, fallback = '') {
    const langDict = KRISHI_TRANSLATIONS[this.currentLang] || KRISHI_TRANSLATIONS.hi;
    return langDict[key] || (KRISHI_TRANSLATIONS.en && KRISHI_TRANSLATIONS.en[key]) || fallback || key;
  }

  onLanguageChange(callback) {
    this.subscribers.push(callback);
  }

  /**
   * Automatically scans DOM for:
   * 1. [data-i18n] -> innerText / textContent
   * 2. [data-i18n-html] -> innerHTML
   * 3. [data-i18n-placeholder] -> placeholder
   * 4. [data-i18n-title] -> title
   * 5. [data-i18n-value] -> input/button value
   */
  translatePage() {
    const lang = this.currentLang;
    const dict = KRISHI_TRANSLATIONS[lang] || KRISHI_TRANSLATIONS.hi;

    // Text content
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.innerText = dict[key];
      } else if (KRISHI_TRANSLATIONS.en[key]) {
        el.innerText = KRISHI_TRANSLATIONS.en[key];
      }
    });

    // HTML content
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      if (dict[key]) {
        el.innerHTML = dict[key];
      } else if (KRISHI_TRANSLATIONS.en[key]) {
        el.innerHTML = KRISHI_TRANSLATIONS.en[key];
      }
    });

    // Placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key]) {
        el.setAttribute('placeholder', dict[key]);
      } else if (KRISHI_TRANSLATIONS.en[key]) {
        el.setAttribute('placeholder', KRISHI_TRANSLATIONS.en[key]);
      }
    });

    // Titles
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      if (dict[key]) {
        el.setAttribute('title', dict[key]);
      } else if (KRISHI_TRANSLATIONS.en[key]) {
        el.setAttribute('title', KRISHI_TRANSLATIONS.en[key]);
      }
    });

    // Values (e.g. submit buttons)
    document.querySelectorAll('[data-i18n-value]').forEach(el => {
      const key = el.getAttribute('data-i18n-value');
      if (dict[key]) {
        el.value = dict[key];
      }
    });

    // Sync any select dropdowns with class .krishi-lang-select
    document.querySelectorAll('.krishi-lang-select').forEach(sel => {
      sel.value = lang;
    });
  }

  /**
   * Creates a modern, styled language selector widget
   */
  renderSelector(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const isCompact = options.compact || false;
    const isDark = options.dark || false;

    const select = document.createElement('select');
    select.className = `krishi-lang-select ${isCompact ? 'compact' : ''} ${isDark ? 'dark' : ''}`;
    select.setAttribute('aria-label', 'Select Language');
    select.style.cursor = 'pointer';

    KRISHI_LANGUAGES.forEach(item => {
      const opt = document.createElement('option');
      opt.value = item.code;
      opt.textContent = `${item.flag} ${item.name} (${item.code.toUpperCase()})`;
      if (item.code === this.currentLang) {
        opt.selected = true;
      }
      select.appendChild(opt);
    });

    select.addEventListener('change', (e) => {
      this.setLanguage(e.target.value);
    });

    container.innerHTML = '';
    
    // Wrap with optional globe icon badge
    const wrap = document.createElement('div');
    wrap.className = 'krishi-lang-picker-wrap';
    wrap.innerHTML = `<i class="fa-solid fa-globe" style="color: var(--primary-green, #2e7d32); font-size: 14px; margin-right: 6px;"></i>`;
    wrap.appendChild(select);

    container.appendChild(wrap);
  }
}

// Instantiate global singleton
window.krishiI18n = new KrishiI18n();

// Auto-run when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.krishiI18n.translatePage();
});
