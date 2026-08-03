import NavbarMenu from "./navbar-menu/NavbarMenu";
import UserMenu from "./user-menu/UserMenu";
import images from "../../assets/images";
import Search from "../search/Search";
import { motion, useReducedMotion } from "framer-motion";

const Navbar = () => {
  const reducedMotion = useReducedMotion();
  return (
    <motion.header
      initial={reducedMotion ? false : { opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur"
    >
      <div className="mx-auto max-w-7xl px-4 pt-3 sm:px-6 md:pt-4 lg:px-8">
        <div className="grid grid-cols-[1fr_auto] items-center md:grid-cols-[1fr_auto_1fr]">
          <a href="/" className="flex w-fit items-center gap-2" aria-label="Flypnp home">
            <img src={images.logo} alt="" className="h-10 w-10 object-contain sm:h-11 sm:w-11" />
            <span className="text-xl font-bold tracking-tight text-rose-500">Flypnp</span>
          </a>
          <NavbarMenu />
          <div className="justify-self-end"><UserMenu /></div>
        </div>
        <Search />
      </div>
    </motion.header>
  );
};

export default Navbar;
