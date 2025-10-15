import { Button } from "@shared/components/ui/button";
import { Dialog, DialogContent } from "@shared/components/ui/dialog";
import { Dispatch, FC, SetStateAction } from "react";
import Logout from "@assets/icons/logout.svg";
import { logout } from "@shared/api/logout";
import { useNavigate } from "react-router-dom";
import { useModalStore } from "@shared/store";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@shared/api/bookinglist";
import { IUser } from "@shared/api/types/bookinglist";
import { IOldParams } from "./EditRestaurant";
import { DialogTitle } from "@radix-ui/react-dialog";
import { definePrtivate } from "@shared/utils/isPrivate";

interface PopupUserProps {
  isOpen: boolean;
  onClose: () => void;
  setInitialParams: Dispatch<SetStateAction<IOldParams>>;
}

const PopupUser: FC<PopupUserProps> = ({
  isOpen,
  onClose,
  setInitialParams,
}) => {
  const navigate = useNavigate();

  const { closeUser, openEditRestaurant } = useModalStore();

  const handleNavigateTl = () => {
    closeUser();
    navigate("/tableslist");
  };

  const handleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    navigate("/");

    closeUser();
  };

  const { data: user } = useQuery<
    IUser & { roles: [{ id: string; name: string }] }
  >({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });

  const isPrtivate = definePrtivate(user)

  const handleNavigateBd = () => {
    navigate("/database");
  };


  const changeWorkingTime = () => {
    const restaurant = user?.restaurant.data!;
    const { end_time, start_time, name, id } = restaurant;

    if (end_time) {
      const params = {
        end_time,
        name,
        start_time,
        id,
      };

      setInitialParams(params);
      closeUser();
      openEditRestaurant();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[362px]  text-center">
        <DialogTitle></DialogTitle>
        <div>
          <p className="font-semibold mb-[10px]">Администратор:</p>
          <p className="text-1">{user?.name}</p>
          <p className="text-1 font-semibold mt-[10px] mb-[20px]">
            +79126450818
          </p>
          <p className="text-1 font-semibold mb-[10px]">Ресторан:</p>
          <p className="text-1 mb-[10px]">{user?.restaurant?.data?.name}</p>

          {
            isPrtivate && <Button
              onClick={handleNavigateBd}
              className="bg-[#7AB5AF] text-[white] font-extrabold w-[255px] h-[41px] mb-[10px] text-sm"
            >
              База данных
            </Button>
          }

          {isPrtivate && (
            <Button
              onClick={handleNavigateTl}
              className="bg-[#fbaa4b] text-[white] font-extrabold w-[255px] h-[41px] mb-[10px] text-sm"
            >
              Редактирование столов
            </Button>
          )}
          {isPrtivate && (
            <Button
              onClick={changeWorkingTime}
              className="bg-8 text-[white] font-extrabold w-[255px] h-[41px] mb-[10px] text-sm"
            >
              Изменить график работы
            </Button>
          )}
          <Button
            className="bg-[#c86162] font-extrabold text-3 w-[255px] h-[41px] text-sm "
            onClick={() => {
              logout().then(() => handleLogOut());
            }}
          >
            <Logout className="fill-[white]" />
            Выйти
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PopupUser;
