import { useState, useEffect } from "react";
import Search from "../../search/Search";

interface NavbarMenuProps {
  active: string;
}

interface NavMenuClickProps {
  menuClick: boolean;
}

const NavbarMenu = ({ menuClick }: NavMenuClickProps) => {
  const [active, setActive] = useState<NavbarMenuProps>({ active: "Stays" });
  const [myMenuClick, setMyMenuClick] = useState<boolean>(false);

  const handleClick = (name: string) => {
    setActive({ active: name });
    setMyMenuClick(name === "Experiences");
  };

  useEffect(() => {
    setMyMenuClick(menuClick);
  }, [menuClick]);

  return (
    <div className="flex flex-col items-center">
      <ul className="flex items-center space-x-6 text-lg font-medium text-gray-600">
        {["Stays", "Experiences", "Online Experiences"].map((menu, index) => (
          <li
            key={index}
            className={`${
              active.active === menu ? "text-black" : ""
            } cursor-pointer`}
            onClick={() => handleClick(menu)}
          >
            {menu}
          </li>
        ))}
      </ul>
      <Search menuClick={myMenuClick} />
    </div>
  );
};

export default NavbarMenu;
