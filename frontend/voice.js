// 🎤 Voice AI Assistant Service
class VoiceAssistant {
  constructor() {
    this.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = this.SpeechRecognition ? new this.SpeechRecognition() : null;
    this.isListening = false;
    this.setupRecognition();
  }

  setupRecognition() {
    if (!this.recognition) return;
    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.lang = 'hi-IN'; // Hindi default

    this.recognition.onstart = () => {
      this.isListening = true;
      if (window.onVoiceStart) window.onVoiceStart();
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (window.onVoiceEnd) window.onVoiceEnd();
    };

    this.recognition.onerror = (event) => {
      if (window.onVoiceError) window.onVoiceError(event.error);
    };

    this.recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      if (window.onVoiceTranscript) {
        window.onVoiceTranscript(finalTranscript || interimTranscript);
      }
    };
  }

  start(lang = 'hi-IN') {
    if (!this.recognition) {
      alert('Speech Recognition not supported in your browser.');
      return false;
    }
    this.recognition.lang = lang;
    this.recognition.start();
    return true;
  }

  stop() {
    if (this.recognition) this.recognition.stop();
  }

  speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }
}

window.VoiceAssistant = VoiceAssistant;
