export const DEBUG = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Voice settings
export const VOICE_ENABLED_KEY = 'btpom_voice_enabled';

// Global state for immediate access
let voiceEnabled = true;

// Initialize from localStorage
try {
  const saved = localStorage.getItem(VOICE_ENABLED_KEY);
  voiceEnabled = saved === null ? true : saved === 'true';
} catch (e) {
  console.warn('Could not read voice setting from localStorage:', e);
}

export function isVoiceEnabled() {
  return voiceEnabled;
}

export function setVoiceEnabled(enabled) {
  voiceEnabled = enabled;
  try {
    localStorage.setItem(VOICE_ENABLED_KEY, enabled.toString());
  } catch (e) {
    console.warn('Could not save voice setting to localStorage:', e);
  }
}

