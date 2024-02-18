export const getVideoLength = (miliseconds: number) => {
  const minutes = Math.floor(miliseconds / 60);
  const seconds = Math.floor(miliseconds % 60);

  return `${minutes}:${seconds}`;
};
