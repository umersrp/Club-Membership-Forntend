import { menuItems } from "./data";
import { studentMenu } from "./data";
import { clubLeaderMenu } from "./data";

const userRole = localStorage.getItem("user-role");

export const getMenuByRole = (userRole) => {
  switch (userRole) {
    case "admin":
      return menuItems;
    case "student":
      return studentMenu;
    case "ClubLeader":
      return clubLeaderMenu;
    default:
      return [];
  }
};
