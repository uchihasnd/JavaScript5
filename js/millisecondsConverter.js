export const convertMilliseconds = (totalMilliseconds) => {
  const minutes = Math.floor(totalMilliseconds / 60000);
  const seconds = ((totalMilliseconds / 1000) % 60).toFixed(0).padStart(2, "0");

  return { minutes, seconds };
};
