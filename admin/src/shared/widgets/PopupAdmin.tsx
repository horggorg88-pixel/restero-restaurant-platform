import { Button } from "@shared/components/ui/button";
import { Dialog, DialogContent, DialogDescription } from "@shared/components/ui/dialog";
import { FC } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@shared/api/bookinglist";

interface PopupAdminProps {
  isOpen: boolean;
  onClose: () => void;
}

const PopupAdmin: FC<PopupAdminProps> = ({ isOpen, onClose }) => {
  const { data: user } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    staleTime: 0, // Принудительно обновляем данные
    gcTime: 0, // Не кэшируем данные
  });

  // Отладочная информация
  console.log('PopupAdmin user data:', user);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[295px]">
        <DialogDescription>
          Информация о текущем пользователе и ресторане
        </DialogDescription>
        <div>
          <p className="font-semibold  mb-[10px]">
            {user?.role === 'admin' ? 'Администратор:' : user?.role === 'manager' ? 'Менеджер:' : 'Пользователь:'}
          </p>

          <p className="text-1">
            {user?.firstName || 'Сотрудник'} {user?.lastName || 'Ресторана'}
          </p>

          <p className="text-1 font-semibold mt-[5px] mb-[5px]">
            {user?.email || 'admin@admin.com'}
          </p>

          <p className="text-1 font-semibold mt-[10px] mb-[20px]">
            {user?.phone || '+79994033950'}
          </p>

          <p className="text-1 font-semibold mb-[10px]">Ресторан:</p>

          <p className="text-1 mb-[10px]">
            {user?.restaurant?.data?.name || 'Ресторан 12'}
          </p>

          <Button className="bg-1 text-3 font-extrabold mt-[32px] mb-[10px] w-[255px] h-[41px] text-sm">
            История бронирований
          </Button>
          <Button className="bg-9 font-extrabold text-1 w-[255px] h-[41px] mb-[10px] text-sm">
            Редактировать столы
          </Button>
          <Button className="bg-5 font-extrabold text-3 w-[255px] h-[41px] text-sm mb-[52px]">
            База данных
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PopupAdmin;
