export const parseTime = (
  time: string | undefined
): { hour: number; minute: number } => {
  if (time) {
    const [hour, minute] = time.split(":");
    return {
      hour: parseInt(hour, 10),
      minute: parseInt(minute, 10),
    };
  } else {
    const now = new Date();
    let minutes = now.getMinutes();
    let roundedMinutes = Math.ceil(minutes / 15) * 15;

    if (roundedMinutes === 60) {
      roundedMinutes = 0;
      now.setHours(now.getHours() + 1);
    }

    return {
      hour: now.getHours(),
      minute: roundedMinutes,
    };
  }
};
