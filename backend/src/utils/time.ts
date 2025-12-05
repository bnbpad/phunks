export const get24HoursAgoTimestamp = (): number => {
  const now = Math.floor(Date.now() / 1000);
  return now - 86400;
};
