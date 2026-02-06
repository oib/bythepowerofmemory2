import { isVoiceEnabled } from './config.js';

export function playSound(name) {
  const enabled = isVoiceEnabled();
  
  if (!enabled) {
    // Stop any ongoing speech
    speechSynthesis.cancel();
    return;
  }
  
  // Cancel any ongoing speech
  speechSynthesis.cancel();
  
  const text = name === "correct" ? "Correct" : name === "wrong" ? "Wrong" : name;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.6; // Even slower speech rate (was 0.7)
  utterance.pitch = 0.9; // Slightly lower pitch
  utterance.volume = 0.9; // Slightly lower volume

  // Get voices
  const voices = speechSynthesis.getVoices();
  
  const robotVoice = voices.find(v =>
    v.name.toLowerCase().includes("google") || v.name.toLowerCase().includes("robot")
  );

  if (robotVoice) {
    utterance.voice = robotVoice;
  }
  
  speechSynthesis.speak(utterance);
}

// Test function - can be called from console
export function testVoice() {
  playSound('correct');
}

// Stop all speech
export function stopVoice() {
  speechSynthesis.cancel();
}

