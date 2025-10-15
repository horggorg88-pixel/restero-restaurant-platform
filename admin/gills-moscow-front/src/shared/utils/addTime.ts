export const addTime = (startTime: number, additionalTime: number): number => {
  let startHours = Math.floor(startTime / 100);
  let startMinutes = startTime % 100;
  let addHours = Math.floor(additionalTime / 100);
  let addMinutes = additionalTime % 100;

  let totalMinutes = startMinutes + addMinutes;
  let totalHours = startHours + addHours;

  if (totalMinutes >= 60) {
    totalHours += Math.floor(totalMinutes / 60);
    totalMinutes = totalMinutes % 60;
  }

  totalHours = totalHours % 24;

  return totalHours * 100 + totalMinutes;
};
