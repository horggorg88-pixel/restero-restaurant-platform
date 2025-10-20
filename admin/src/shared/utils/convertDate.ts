export const convertDate = (date: string) => {
  if (!date) {
    return "";
  }

  const splited = date.split(" ");

  if (splited.length === 1) {
    return splited[0].split("-").reverse().join(".");
  }

  return splited.slice(0, 1).join("").split("-").reverse().join(".");
};
