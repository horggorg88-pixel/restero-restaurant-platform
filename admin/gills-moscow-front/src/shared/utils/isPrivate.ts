import { IUser } from "@shared/api/types/bookinglist";

export const definePrtivate = (
  user:
    | (IUser & {
        roles: [
          {
            id: string;
            name: string;
          }
        ];
      })
    | undefined
) => {
  if (!user) {
    return false;
  }

  if (user.roles) {
    const role = user?.roles[0]?.name;

    return role === "admin";
  }

  return false;
};
