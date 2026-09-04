import React, { useState } from "react";
import { FiInfo, FiVolume2, FiSquare } from "react-icons/fi";
import { useLanguage } from "../context/LanguageContext";

export default function LanguageGuide({ page }) {
  const { copy, speak, stopSpeaking } = useLanguage();
  const [speaking, setSpeaking] = useState(false);
  const text = copy.pages[page] || copy.pages.home;

  const toggleVoice = () => {
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
      return;
    }
    if (speak(`${copy.guide}. ${text}`)) setSpeaking(true);
  };

  return (
    <section className="language-guide" aria-label={copy.guide}>
      <div className="language-guide-icon">
        <FiInfo />
      </div>
      <div className="language-guide-copy">
        <strong>{copy.guide}</strong>
        <p>{text}</p>
      </div>
      <button
        className="language-guide-voice"
        onClick={toggleVoice}
        type="button"
        aria-label={speaking ? copy.stop : copy.listen}
      >
        {speaking ? <FiSquare /> : <FiVolume2 />}
        <span>{speaking ? copy.stop : copy.listen}</span>
      </button>
    </section>
  );
}
