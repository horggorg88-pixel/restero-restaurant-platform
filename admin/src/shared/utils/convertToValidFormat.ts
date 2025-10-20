export const convertToValidFormat = (invalidFormat: string[]): string[] => {
  if (!Array.isArray(invalidFormat)) {
    return ["", ""];
  }

  let [originalDate, originalTime] = invalidFormat;

  if (!originalDate || !originalTime) {
    return ["", ""];
  }

  originalDate = originalDate.split("-").reverse().join(".");
  originalTime = originalTime.split(":").slice(0, 2).join(":");

  return [originalDate, originalTime];
};
