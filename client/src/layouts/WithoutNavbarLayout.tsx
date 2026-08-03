import { AnimatePresence } from "framer-motion";
import { useLocation, useOutlet } from "react-router-dom";
import MotionScene from "../components/motion/MotionScene";

const WithoutNavbarLayout = () => {
  const location = useLocation();
  const outlet = useOutlet();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <MotionScene key={location.pathname}>
        {outlet}
      </MotionScene>
    </AnimatePresence>
  );
};

export default WithoutNavbarLayout;
