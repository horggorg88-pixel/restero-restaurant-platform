import { IPaginationParams } from "@shared/api/types/database";

export const tableHeadingParams = [
  "Дата брони",
  "Время брони",
  "Помещение",
  "Стол",
  "Имя гостя",
  "Телефон",
  // "Кол-во чел.",
  // "Комментарий",
  "Дата создания",
  "Время",
  "Администратор",
  // "Действие",
];

export const tabs = [
  {
    text: "Запланированные",
    id: 0,
  },
  {
    text: "Исполняются сейчас",
    id: 3,
  },
  {
    text: "Отмененные",
    id: 1,
  },
  {
    text: "Завершенные",
    id: 2,
  },
  {
    text: "Все",
  },
];

export const bookingActions = {
  0: {
    action: "Редактировать",
    color: "#C86162",
  },
  1: {
    action: "Восстановить",
    color: "#3D8B95",
  },
  2: {
    action: "Повторить",
    color: "#FBAA4B",
  },
};

export const defaultPaginationParams: IPaginationParams = {
  current_page: 1,
  per_page: 15,
  total: 0,
  total_pages: 1,
  count: 0,
  links: {
    previous: "",
    next: "",
  },
};
