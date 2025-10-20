export const removeSeconds = (time: string | undefined) => {
  if (!time) {
    return "";
  }

  return time.split(":").slice(0, 2).join(":");
};
