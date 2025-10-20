export const calculeItemsAmount = (item: HTMLElement): number => {
  if (!item) {
    return 15;
  }

  const height = parseInt(window.getComputedStyle(item).height);
  const itemHeight = 46;
  const itemsAmount = Math.floor(height / itemHeight);

  return itemsAmount ? itemsAmount - 2 : 15;
};
