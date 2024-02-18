export const translateAudio = async () => {
  const response = await fetch("/api/translate-audio");

  const data = await response.json();

  return data;
};
