import React, { useState } from "react";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const VoiceToTextButton = ({ onTextGenerated }) => {
  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US"; 
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onTextGenerated(transcript); // Parent se handle hoga
    };

    recognition.start();
  };

  return (
    <button
      type="button"
      className={`ml-2 px-3 py-1 rounded-full text-white ${
        isListening ? "bg-red-500" : "bg-blue-500"
      }`}
      onClick={startListening}
      title="Voice to Text"
    >
      🎤
    </button>
  );
};

export default VoiceToTextButton;
