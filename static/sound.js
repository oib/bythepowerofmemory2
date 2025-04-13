export function playSound(name) {
  const text = name === "correct" ? "Correct" : name === "wrong" ? "Wrong" : name;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";

  const voices = speechSynthesis.getVoices();
  const robotVoice = voices.find(v =>
    v.name.toLowerCase().includes("google") || v.name.toLowerCase().includes("robot")
  );

  if (robotVoice) utterance.voice = robotVoice;
  speechSynthesis.speak(utterance);
}

