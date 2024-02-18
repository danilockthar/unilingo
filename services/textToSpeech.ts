export const postTextToSpeech = async (text: string) => {
  const response = await fetch("/api/text-to-speech", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ text }),
  });

  const data = await response.json();

  return data;
};
