import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import { AnimatePresence } from "framer-motion";
import { useLocation, useOutlet } from "react-router-dom";
import MotionScene from "../components/motion/MotionScene";

const WithNavbarLayout = () => {
  const location = useLocation();
  const outlet = useOutlet();

  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait" initial={false}>
        <MotionScene key={location.pathname}>
          {outlet}
        </MotionScene>
      </AnimatePresence>
      <Footer />
    </>
  );
};

export default WithNavbarLayout;
