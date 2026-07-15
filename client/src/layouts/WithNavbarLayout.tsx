import Navbar from "../components/navbar/Navbar";
import { Outlet } from "react-router-dom";

const WithNavbarLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default WithNavbarLayout;
