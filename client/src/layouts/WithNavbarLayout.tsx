import Navbar from "../components/navbar/Navbar";
import { Outlet } from "react-router-dom";

const WithNavbarLayout = ({ menuClick }: { menuClick: boolean }) => {
  return (
    <>
      <Navbar menuClick={menuClick} />
      <Outlet />
    </>
  );
};

export default WithNavbarLayout;
