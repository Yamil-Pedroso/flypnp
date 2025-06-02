import NavbarMenu from "./navbar-menu/NavbarMenu";
import UserMenu from "./user-menu/UserMenu";
import images from "../../assets/images";

interface NavbarProps {
  menuClick: boolean;
}

const Navbar = ({ menuClick }: NavbarProps) => {
  return (
    <header className="bg-white shadow px-8 py-6 flex justify-between items-center">
      <div className="flex items-center cursor-pointer text-xl font-semibold text-black">
        <a href="/" className="flex items-center">
          <img src={images.logo} alt="logo" className="w-20" />
          <p className="ml-2 text-[#f94a52]">Flypnp</p>
        </a>
      </div>
      <NavbarMenu menuClick={menuClick} />
      <UserMenu />
    </header>
  );
};

export default Navbar;
