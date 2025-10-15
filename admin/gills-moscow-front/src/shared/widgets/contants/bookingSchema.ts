import { z } from "zod";

export const bookingSchema = z.object({
  room_id: z.string().min(1, "Выберите зал"),
  table_ids: z.array(z.string()).nonempty("Выберите стол"),
  comment: z.string().optional(),
  count_people: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "больше 0",
    }),
  client_name: z.string().min(1, "Введите ФИО"),
  client_phone: z
    .string()
    .min(1, "Введите телефон клиента")
    .refine((val) => /^\+7\d{10}$/.test(val), {
      message: "Номер должен начинаться с +7 и содержать 11 цифр",
    }),
  count_booking_time: z.string().min(1, "кол-во часов"),
  booking_date: z.string().min(1, "Укажите дату"),
  booking_time: z.string().min(1, "формат 10:00"),
});
