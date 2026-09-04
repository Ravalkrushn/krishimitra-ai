import React, { createContext, useContext, useEffect, useState } from "react";

const LANGUAGE_OPTIONS = {
  en: { label: "English", speech: "en-IN" },
  hi: { label: "हिंदी", speech: "hi-IN" },
  gu: { label: "ગુજરાતી", speech: "gu-IN" },
};

const COPY = {
  en: {
    nav: {
      home: "Home",
      market: "Market Intelligence",
      buyers: "Find Buyers",
      quality: "Quality Assistant",
      store: "Sell or Store",
      dashboard: "Income Dashboard",
      chat: "AI Farmer Assistant",
      tools: "Smart Farmer Tools",
      farmers: "Manage Farmers",
      manageBuyers: "Manage Buyers",
      notifications: "Notifications",
      help: "Help & Support",
      settings: "Settings",
      watson: "Watson API Test",
    },
    language: "Language",
    voiceGuide: "Voice Guide",
    guide: "How to use this page",
    brandTagline: "From Farm to Best Market Decision",
    demoData: "DEMO DATA",
    yourData: "Your Data",
    safe: "Safe",
    verifiedFarmer: "Verified Farmer",
    logout: "Logout",
    signIn: "Sign In",
    accessDashboard: "Access your KrishiMitra AI dashboard",
    username: "Username",
    password: "Password",
    enterUsername: "Enter your username",
    enterPassword: "Enter your password",
    homeTitle: "Home",
    marketTitle: "Market Intelligence",
    buyersTitle: "Find Buyers",
    qualityTitle: "Quality Assistant",
    storeTitle: "Sell or Store",
    dashboardTitle: "Income Dashboard",
    chatTitle: "AI Assistant",
    uploadPhoto: "Upload Photo",
    listen: "Listen",
    stop: "Stop",
    pages: {
      home: "Enter your crop, quantity, and location here. Then select Get My Best Market Decision to compare prices, buyers, quality, and storage options.",
      market:
        "Choose Cotton or Groundnut to compare mandi prices, trends, MSP, and the best market for your location.",
      buyers:
        "Review buyer match scores, offered prices, distance, and quality requirements. Open a buyer card to see contact options.",
      quality:
        "Upload a crop photo or enter moisture and trash details manually. The assistant estimates quality and explains its market impact.",
      store:
        "Compare selling now with storing for later. Review expected revenue, storage cost, and the recommendation before deciding.",
      dashboard:
        "This page brings your analysis together. Review income, the AI recommendation, matched buyers, and the assumptions used.",
      chat: "Ask questions in everyday language about prices, buyers, quality, income, or storage. The assistant replies using Watson or local farmer tools.",
      tools:
        "Explore weather risk, voice help, government schemes, transport estimates, and crop health tools.",
      farmers:
        "Select a farmer profile to load their details, or manage demo farmer records from this screen.",
      manageBuyers:
        "Use this area to review and manage buyer records used by the matching workflow.",
      notif: "Review important updates and analysis notifications here.",
      help: "Open this guide from any page when you need a short explanation of the available actions.",
      settings: "Review application preferences and language settings here.",
      watson:
        "Run the diagnostics only when the local proxy is running. It checks the connection to Watson Orchestrate.",
    },
  },
  hi: {
    nav: {
      home: "होम",
      market: "बाज़ार जानकारी",
      buyers: "खरीदार खोजें",
      quality: "गुणवत्ता सहायक",
      store: "बेचें या रखें",
      dashboard: "आय डैशबोर्ड",
      chat: "किसान AI सहायक",
      tools: "स्मार्ट किसान टूल्स",
      farmers: "किसान प्रबंधन",
      manageBuyers: "खरीदार प्रबंधन",
      notifications: "सूचनाएं",
      help: "मदद और सहायता",
      settings: "सेटिंग्स",
      watson: "Watson API जांच",
    },
    language: "भाषा",
    voiceGuide: "आवाज़ में मार्गदर्शन",
    listen: "सुनें",
    stop: "रोकें",
    guide: "इस पेज का उपयोग",
    brandTagline: "खेत से सबसे अच्छे बाजार निर्णय तक",
    demoData: "डेमो डेटा",
    yourData: "आपका डेटा",
    safe: "सुरक्षित",
    verifiedFarmer: "सत्यापित किसान",
    logout: "लॉग आउट",
    signIn: "साइन इन",
    accessDashboard: "अपने KrishiMitra AI डैशबोर्ड पर जाएं",
    username: "उपयोगकर्ता नाम",
    password: "पासवर्ड",
    enterUsername: "अपना उपयोगकर्ता नाम लिखें",
    enterPassword: "अपना पासवर्ड लिखें",
    homeTitle: "होम",
    marketTitle: "बाज़ार जानकारी",
    buyersTitle: "खरीदार खोजें",
    qualityTitle: "गुणवत्ता सहायक",
    storeTitle: "बेचें या रखें",
    dashboardTitle: "आय डैशबोर्ड",
    chatTitle: "AI सहायक",
    uploadPhoto: "फोटो अपलोड करें",
    pages: {
      home: "यहां फसल, मात्रा और स्थान भरें। फिर सबसे अच्छा बाजार निर्णय चुनकर भाव, खरीदार, गुणवत्ता और भंडारण विकल्पों की तुलना करें।",
      market:
        "कपास या मूंगफली चुनकर मंडी भाव, रुझान, MSP और आपके लिए सबसे अच्छा बाजार देखें।",
      buyers:
        "खरीदार का मिलान स्कोर, भाव, दूरी और गुणवत्ता की जरूरत देखें। विवरण और संपर्क के लिए खरीदार कार्ड खोलें।",
      quality:
        "फसल की फोटो अपलोड करें या नमी और कचरे की जानकारी भरें। सहायक गुणवत्ता और बाजार पर उसका असर बताएगा।",
      store:
        "अभी बेचने और बाद में रखने की तुलना करें। अनुमानित आय, भंडारण खर्च और सलाह देखकर निर्णय लें।",
      dashboard:
        "यहां पूरी रिपोर्ट देखें: आय, AI सलाह, खरीदार और इस्तेमाल की गई धारणाएं।",
      chat: "भाव, खरीदार, गुणवत्ता, आय या भंडारण के बारे में सामान्य भाषा में सवाल पूछें।",
      tools:
        "मौसम जोखिम, आवाज़ सहायता, सरकारी योजनाएं, परिवहन और फसल स्वास्थ्य टूल देखें।",
      farmers:
        "किसान प्रोफाइल चुनकर जानकारी लोड करें या डेमो रिकॉर्ड प्रबंधित करें।",
      manageBuyers:
        "मिलान प्रक्रिया में इस्तेमाल होने वाले खरीदार रिकॉर्ड यहां प्रबंधित करें।",
      notif: "महत्वपूर्ण अपडेट और विश्लेषण सूचनाएं यहां देखें।",
      help: "किसी भी पेज पर उपलब्ध कार्यों का छोटा विवरण यहां देखें।",
      settings: "ऐप की पसंद और भाषा सेटिंग यहां बदलें।",
      watson:
        "स्थानीय proxy चलने पर ही जांच शुरू करें। यह Watson Orchestrate कनेक्शन देखता है।",
    },
  },
  gu: {
    nav: {
      home: "હોમ",
      market: "બજાર માહિતી",
      buyers: "ખરીદદાર શોધો",
      quality: "ગુણવત્તા સહાયક",
      store: "વેચો અથવા સંગ્રહો",
      dashboard: "આવક ડેશબોર્ડ",
      chat: "ખેડૂત AI સહાયક",
      tools: "સ્માર્ટ ખેડૂત ટૂલ્સ",
      farmers: "ખેડૂત વ્યવસ્થાપન",
      manageBuyers: "ખરીદદાર વ્યવસ્થાપન",
      notifications: "સૂચનાઓ",
      help: "મદદ અને સહાય",
      settings: "સેટિંગ્સ",
      watson: "Watson API તપાસ",
    },
    language: "ભાષા",
    voiceGuide: "અવાજ માર્ગદર્શન",
    listen: "સાંભળો",
    stop: "બંધ કરો",
    guide: "આ પેજનો ઉપયોગ",
    brandTagline: "ખેતરથી શ્રેષ્ઠ બજાર નિર્ણય સુધી",
    demoData: "ડેમો ડેટા",
    yourData: "તમારો ડેટા",
    safe: "સુરક્ષિત",
    verifiedFarmer: "ચકાસાયેલ ખેડૂત",
    logout: "લૉગ આઉટ",
    signIn: "સાઇન ઇન",
    accessDashboard: "તમારા KrishiMitra AI ડેશબોર્ડમાં પ્રવેશ કરો",
    username: "વપરાશકર્તા નામ",
    password: "પાસવર્ડ",
    enterUsername: "તમારું વપરાશકર્તા નામ લખો",
    enterPassword: "તમારો પાસવર્ડ લખો",
    homeTitle: "હોમ",
    marketTitle: "બજાર માહિતી",
    buyersTitle: "ખરીદદાર શોધો",
    qualityTitle: "ગુણવત્તા સહાયક",
    storeTitle: "વેચો અથવા સંગ્રહો",
    dashboardTitle: "આવક ડેશબોર્ડ",
    chatTitle: "AI સહાયક",
    uploadPhoto: "ફોટો અપલોડ કરો",
    pages: {
      home: "અહીં પાક, જથ્થો અને સ્થાન ભરો. પછી શ્રેષ્ઠ બજાર નિર્ણય પસંદ કરીને ભાવ, ખરીદદાર, ગુણવત્તા અને સંગ્રહ વિકલ્પો જુઓ.",
      market:
        "કપાસ અથવા મગફળી પસંદ કરીને મંડી ભાવ, વલણ, MSP અને તમારા માટે શ્રેષ્ઠ બજાર જુઓ.",
      buyers:
        "ખરીદદારનો મેચ સ્કોર, ભાવ, અંતર અને ગુણવત્તાની જરૂરિયાત જુઓ. વિગતો અને સંપર્ક માટે કાર્ડ ખોલો.",
      quality:
        "પાકનો ફોટો અપલોડ કરો અથવા ભેજ અને કચરાની વિગતો ભરો. સહાયક ગુણવત્તા અને બજાર પરની અસર સમજાવશે.",
      store:
        "હમણાં વેચવા અને પછી વેચવા માટે સંગ્રહ કરવાની તુલના કરો. આવક, સંગ્રહ ખર્ચ અને સલાહ જોઈને નિર્ણય લો.",
      dashboard:
        "અહીં સંપૂર્ણ પરિણામ જુઓ: આવક, AI સલાહ, ખરીદદાર અને વપરાયેલી ધારણાઓ.",
      chat: "ભાવ, ખરીદદાર, ગુણવત્તા, આવક અથવા સંગ્રહ વિશે સામાન્ય ભાષામાં પ્રશ્ન પૂછો.",
      tools:
        "હવામાન જોખમ, અવાજ સહાય, સરકારી યોજનાઓ, પરિવહન અને પાક સ્વાસ્થ્ય ટૂલ જુઓ.",
      farmers:
        "ખેડૂત પ્રોફાઇલ પસંદ કરીને વિગતો લોડ કરો અથવા ડેમો રેકોર્ડ મેનેજ કરો.",
      manageBuyers:
        "મેચિંગ પ્રક્રિયામાં વપરાતા ખરીદદાર રેકોર્ડ અહીં મેનેજ કરો.",
      notif: "મહત્વપૂર્ણ અપડેટ અને વિશ્લેષણ સૂચનાઓ અહીં જુઓ.",
      help: "દરેક પેજના ઉપયોગની ટૂંકી માહિતી અહીં જુઓ.",
      settings: "એપની પસંદગીઓ અને ભાષા સેટિંગ અહીં બદલો.",
      watson:
        "સ્થાનિક proxy ચાલુ હોય ત્યારે જ તપાસ ચલાવો. આ Watson Orchestrate કનેક્શન તપાસે છે.",
    },
  },
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(
    () => localStorage.getItem("krishimitra-language") || "en",
  );

  useEffect(() => {
    localStorage.setItem("krishimitra-language", language);
    document.documentElement.lang = language;
  }, [language]);
  const value = {
    language,
    setLanguage,
    options: LANGUAGE_OPTIONS,
    copy: COPY[language],
    speak: (text) => {
      if (!window.speechSynthesis) return false;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = LANGUAGE_OPTIONS[language].speech;
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
      return true;
    },
    stopSpeaking: () => window.speechSynthesis?.cancel(),
  };
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
