  // SPEECH SYNTHESIS HELPER (PRESCHOOL & KINDERGARTEN)
  // ========================================================
  function speakText(text, btnEl) {
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const cleanText = String(text || '').replace(/#\d+\s*/, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.92;
      utterance.pitch = 1.05;
      if (btnEl) {
        btnEl.classList.add('speaking');
        utterance.onend = () => btnEl.classList.remove('speaking');
        utterance.onerror = () => btnEl.classList.remove('speaking');
      }
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      // Ignore if speech synthesis is unavailable
    }
  }


// Global Exports
(typeof window !== "undefined" ? window : global).speakText = speakText;
