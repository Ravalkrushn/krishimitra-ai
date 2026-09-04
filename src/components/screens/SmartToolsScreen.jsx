import React, { useState } from "react";
import {
  FiAlertTriangle,
  FiBell,
  FiCheckCircle,
  FiCloudRain,
  FiDollarSign,
  FiMapPin,
  FiMic,
  FiPhone,
  FiShield,
  FiTruck,
  FiVolume2,
} from "react-icons/fi";
import { GiCottonFlower, GiWheat } from "react-icons/gi";
import {
  MdAssignment,
  MdHealthAndSafety,
  MdLocalShipping,
  MdOutlineWarehouse,
} from "react-icons/md";
import { useLanguage } from "../../context/LanguageContext";

const TOOL_DATA = {
  weather: { icon: <FiCloudRain />, color: "blue" },
  voice: { icon: <FiMic />, color: "green" },
  schemes: { icon: <MdAssignment />, color: "amber" },
  logistics: { icon: <FiTruck />, color: "purple" },
  health: { icon: <MdHealthAndSafety />, color: "red" },
};

export default function SmartToolsScreen({ profile }) {
  const { language } = useLanguage();
  const [activeTool, setActiveTool] = useState("weather");
  const [listening, setListening] = useState(false);
  const [alertSaved, setAlertSaved] = useState(false);
  const crop = profile?.crop === "groundnut" ? "Groundnut" : "Cotton";

  const labels = {
    en: {
      title: "Smart Farmer Tools",
      sub: "Practical decision support for weather, voice, schemes, transport and crop health.",
      weather: "Weather Risk",
      voice: "Voice Assistant",
      schemes: "Schemes",
      logistics: "Logistics",
      health: "Crop Health",
      snapshot: "Today’s farm snapshot",
      temp: "32°C",
      rain: "Rain chance 35%",
      humidity: "Humidity 62%",
      alert: "Save Price Alert",
      saved: "Price Alert Saved",
      listen: "Start Listening",
      stop: "Stop Listening",
      speak: "Ask in your language",
      schemeTitle: "Recommended scheme",
      schemeText:
        "PM Fasal Bima Yojana may help protect your crop against weather loss. Verify eligibility on the official portal.",
      transport: "Estimated net value",
      transportText: "After transport and handling",
      disease: "Crop check",
      diseaseText:
        "No high-risk signal in this demo scan. Upload a clear leaf image for a real analysis.",
      demo: "STATIC DEMO",
      action: "Open details",
    },
    hi: {
      title: "स्मार्ट किसान टूल्स",
      sub: "मौसम, आवाज़, योजनाओं, परिवहन और फसल स्वास्थ्य के लिए उपयोगी निर्णय सहायता।",
      weather: "मौसम जोखिम",
      voice: "आवाज़ सहायक",
      schemes: "योजनाएं",
      logistics: "परिवहन",
      health: "फसल स्वास्थ्य",
      snapshot: "आज का खेत सारांश",
      temp: "32°C",
      rain: "बारिश की संभावना 35%",
      humidity: "नमी 62%",
      alert: "भाव अलर्ट सेव करें",
      saved: "भाव अलर्ट सेव हो गया",
      listen: "सुनना शुरू करें",
      stop: "सुनना रोकें",
      speak: "अपनी भाषा में पूछें",
      schemeTitle: "सुझाई गई योजना",
      schemeText:
        "PM Fasal Bima Yojana मौसम से होने वाले नुकसान में मदद कर सकती है। पात्रता आधिकारिक पोर्टल पर जांचें।",
      transport: "अनुमानित शुद्ध आय",
      transportText: "परिवहन और हैंडलिंग के बाद",
      disease: "फसल जांच",
      diseaseText:
        "इस डेमो स्कैन में कोई बड़ा जोखिम नहीं मिला। वास्तविक जांच के लिए साफ पत्ती की फोटो अपलोड करें।",
      demo: "स्टैटिक डेमो",
      action: "विवरण खोलें",
    },
    gu: {
      title: "સ્માર્ટ ખેડૂત ટૂલ્સ",
      sub: "હવામાન, અવાજ, યોજનાઓ, પરિવહન અને પાકના સ્વાસ્થ્ય માટે ઉપયોગી નિર્ણય સહાય.",
      weather: "હવામાન જોખમ",
      voice: "અવાજ સહાયક",
      schemes: "યોજનાઓ",
      logistics: "પરિવહન",
      health: "પાક સ્વાસ્થ્ય",
      snapshot: "આજના ખેતરનો સાર",
      temp: "32°C",
      rain: "વરસાદની શક્યતા 35%",
      humidity: "ભેજ 62%",
      alert: "ભાવ એલર્ટ સાચવો",
      saved: "ભાવ એલર્ટ સાચવાયો",
      listen: "સાંભળવાનું શરૂ કરો",
      stop: "સાંભળવાનું બંધ કરો",
      speak: "તમારી ભાષામાં પૂછો",
      schemeTitle: "ભલામણ કરેલી યોજના",
      schemeText:
        "PM Fasal Bima Yojana હવામાનના નુકસાન સામે પાકને મદદ કરી શકે છે. પાત્રતા સત્તાવાર પોર્ટલ પર તપાસો.",
      transport: "અંદાજિત ચોખ્ખી આવક",
      transportText: "પરિવહન અને હેન્ડલિંગ પછી",
      disease: "પાક તપાસ",
      diseaseText:
        "આ ડેમો સ્કેનમાં મોટું જોખમ મળ્યું નથી. વાસ્તવિક તપાસ માટે પાનનો સ્પષ્ટ ફોટો અપલોડ કરો.",
      demo: "સ્ટેટિક ડેમો",
      action: "વિગતો ખોલો",
    },
  }[language];

  const tools = [
    ["weather", labels.weather],
    ["voice", labels.voice],
    ["schemes", labels.schemes],
    ["logistics", labels.logistics],
    ["health", labels.health],
  ];

  const toggleListening = () => {
    if (listening) {
      window.speechSynthesis?.cancel();
      setListening(false);
      return;
    }
    setListening(true);
    const utterance = new SpeechSynthesisUtterance(labels.speak);
    utterance.lang =
      language === "hi" ? "hi-IN" : language === "gu" ? "gu-IN" : "en-IN";
    utterance.onend = () => setListening(false);
    window.speechSynthesis?.speak(utterance);
  };

  return (
    <div className="screen smart-tools-screen">
      <div className="page-title-row smart-tools-header">
        <div>
          <h2>{labels.title}</h2>
          <p className="page-sub">{labels.sub}</p>
        </div>
        <span className="demo-badge">
          <FiShield /> {labels.demo}
        </span>
      </div>

      <div className="smart-tool-tabs">
        {tools.map(([key, label]) => (
          <button
            key={key}
            className={activeTool === key ? "active" : ""}
            onClick={() => setActiveTool(key)}
          >
            {TOOL_DATA[key].icon} {label}
          </button>
        ))}
      </div>

      {activeTool === "weather" && (
        <div className="smart-tool-layout">
          <div className="smart-feature-card blue-panel">
            <div className="smart-feature-icon">
              <FiCloudRain />
            </div>
            <span className="smart-kicker">{labels.weather}</span>
            <h3>{labels.snapshot}</h3>
            <div className="weather-reading">
              <strong>{labels.temp}</strong>
              <span>
                {labels.rain}
                <br />
                {labels.humidity}
              </span>
            </div>
            <div className="smart-warning">
              <FiAlertTriangle /> Harvest window looks usable, but check rain
              before picking.
            </div>
          </div>
          <div className="card card-pad">
            <div className="smart-card-title">
              <FiBell /> Price and weather alerts
            </div>
            <p className="smart-muted">
              Get a reminder when the demo cotton price crosses ₹7,600 or rain
              risk rises.
            </p>
            <button
              className="smart-action-btn"
              onClick={() => setAlertSaved(!alertSaved)}
            >
              {alertSaved ? <FiCheckCircle /> : <FiBell />}{" "}
              {alertSaved ? labels.saved : labels.alert}
            </button>
          </div>
        </div>
      )}

      {activeTool === "voice" && (
        <div className="smart-tool-layout">
          <div className="smart-feature-card green-panel">
            <div className="smart-feature-icon">
              <FiMic />
            </div>
            <span className="smart-kicker">{labels.voice}</span>
            <h3>{labels.speak}</h3>
            <button
              className={`voice-action ${listening ? "listening" : ""}`}
              onClick={toggleListening}
            >
              <FiMic /> {listening ? labels.stop : labels.listen}
            </button>
            <p className="smart-muted">
              {crop} prices, buyers, quality and storage questions are supported
              in this static demo.
            </p>
          </div>
          <div className="card card-pad">
            <div className="smart-card-title">
              <FiVolume2 /> Voice flow
            </div>
            <div className="voice-flow">
              <span>1</span> Speak in Hindi, Gujarati or English
            </div>
            <div className="voice-flow">
              <span>2</span> Select the relevant farmer tool
            </div>
            <div className="voice-flow">
              <span>3</span> Hear a short decision explanation
            </div>
          </div>
        </div>
      )}

      {activeTool === "schemes" && (
        <div className="smart-tool-layout">
          <div className="card card-pad scheme-card">
            <MdAssignment />
            <span className="smart-kicker">{labels.schemes}</span>
            <h3>{labels.schemeTitle}</h3>
            <p>{labels.schemeText}</p>
            <button className="smart-action-btn">
              <FiShield /> {labels.action}
            </button>
          </div>
          <div className="card card-pad">
            <div className="smart-card-title">
              <MdOutlineWarehouse /> Helpful documents
            </div>
            <p className="smart-muted">
              Keep Aadhaar, bank details, land record and crop details ready for
              scheme applications.
            </p>
            <div className="document-chip">
              <FiCheckCircle /> Identity verification
            </div>
            <div className="document-chip">
              <FiCheckCircle /> Land and crop record
            </div>
          </div>
        </div>
      )}

      {activeTool === "logistics" && (
        <div className="smart-tool-layout">
          <div className="card card-pad logistics-card">
            <div className="smart-card-title">
              <MdLocalShipping /> {labels.logistics}
            </div>
            <div className="route-line">
              <FiMapPin />
              <span>{profile?.location || "Jamnagar"}</span>
              <b>52 km</b>
              <span>Gondal buyer</span>
            </div>
            <div className="logistics-total">
              <div>
                <span>{labels.transport}</span>
                <strong>₹3,71,000</strong>
              </div>
              <div>
                <span>{labels.transportText}</span>
                <strong>₹3,64,500</strong>
              </div>
            </div>
          </div>
          <div className="card card-pad">
            <div className="smart-card-title">
              <FiPhone /> Pickup preference
            </div>
            <p className="smart-muted">
              Demo buyer offers pickup. Transport estimate includes loading and
              handling.
            </p>
            <button className="smart-action-btn">
              <FiTruck /> Request pickup
            </button>
          </div>
        </div>
      )}

      {activeTool === "health" && (
        <div className="smart-tool-layout">
          <div className="smart-feature-card red-panel">
            <div className="smart-feature-icon">
              {crop === "Cotton" ? <GiWheat /> : <GiCottonFlower />}
            </div>
            <span className="smart-kicker">{labels.health}</span>
            <h3>{labels.disease}</h3>
            <p>{labels.diseaseText}</p>
            <div className="health-meter">
              <span style={{ width: "78%" }} />
            </div>
            <small>Demo confidence: 78%</small>
          </div>
          <div className="card card-pad">
            <div className="smart-card-title">
              <FiShield /> Safe next step
            </div>
            <p className="smart-muted">
              Do not spray chemicals based only on an AI estimate. Confirm with
              a local agriculture officer.
            </p>
            <button className="smart-action-btn">
              <FiPhone /> Contact advisor
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
