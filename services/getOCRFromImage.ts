export const getOCRFromImage = async () => {
  const response = await fetch("/api/ocr-image");

  const data = await response.json();

  return data;
};
