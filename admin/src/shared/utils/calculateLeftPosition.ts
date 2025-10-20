export const calculateLeftPosition = (
  startTime: string,
  intervalMinutes: number = 30,
  blockWidth: number = 90
): number => {
  try {
    const timeArray = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const formattedTime = `${String(hour).padStart(2, "0")}:${String(
          minute
        ).padStart(2, "0")}`;
        timeArray.push(formattedTime);
      }
    }

    const [hours, minutes] = startTime.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes;

    let lowerIndex = -1;
    let upperIndex = -1;

    for (let i = 0; i < timeArray.length; i++) {
      const [intervalHours, intervalMinutes] = timeArray[i]
        .split(":")
        .map(Number);
      const intervalTotalMinutes = intervalHours * 60 + intervalMinutes;

      if (intervalTotalMinutes <= totalMinutes) {
        lowerIndex = i;
      }
      if (intervalTotalMinutes >= totalMinutes) {
        upperIndex = i;
        break;
      }
    }

    if (lowerIndex === -1) return 0;

    if (upperIndex === -1) return (timeArray.length - 1) * blockWidth;

    const [lowerHours, lowerMinutes] = timeArray[lowerIndex]
      .split(":")
      .map(Number);
    const lowerTotalMinutes = lowerHours * 60 + lowerMinutes;

    const [upperHours, upperMinutes] = timeArray[upperIndex]
      .split(":")
      .map(Number);
    const upperTotalMinutes = upperHours * 60 + upperMinutes;

    if (upperTotalMinutes === lowerTotalMinutes) {
      return lowerIndex * blockWidth;
    }

    const intervalFraction =
      (totalMinutes - lowerTotalMinutes) /
      (upperTotalMinutes - lowerTotalMinutes);

    const position = lowerIndex * blockWidth + intervalFraction * blockWidth;

    if (isNaN(position)) {
      console.log(intervalMinutes);
    }

    return position;
  } catch (error) {
    return 0;
  }
};
