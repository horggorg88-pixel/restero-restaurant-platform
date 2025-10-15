import { Button } from "@shared/components/ui/button";
import PopupAdmin from "@shared/widgets/PopupAdmin";
import { useState } from "react";
import { Link } from "react-router-dom";

const Popups = () => {
  const [isOpenAdmin, setIsOpenAdmin] = useState<boolean>(false);

  const handleOpenAdmin = () => {
    setIsOpenAdmin(true);
  };

  const handleCloseAdmin = () => {
    setIsOpenAdmin(false);
  };

  return (
    <div>
      <PopupAdmin isOpen={isOpenAdmin} onClose={handleCloseAdmin} />

      <div className="flex gap-[10px] ml-[10px] mt-[10px]">
        <Link to="/gantt">
          <Button variant={"outline"}>На главную</Button>
        </Link>

        <Button onClick={handleOpenAdmin}>Админка</Button>
      </div>
    </div>
  );
};

export default Popups;
