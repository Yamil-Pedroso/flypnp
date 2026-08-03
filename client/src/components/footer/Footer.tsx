import { Link } from "react-router-dom";
import { Heart, Mail, MapPin } from "lucide-react";
import { FaInstagram } from "react-icons/fa6";
import images from "../../assets/images";
import { motion, useReducedMotion } from "framer-motion";
import { useAuth } from "../../lib/hooks";
import { CONTACT_GMAIL_COMPOSE_URL } from "../../config/contact";

const Footer = () => {
  const year = new Date().getFullYear();
  const reducedMotion = useReducedMotion();
  const { user } = useAuth();

  return (
    <motion.footer
      initial={reducedMotion ? false : { opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
      className="border-t border-slate-800 bg-slate-950 text-slate-300"
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-md">
            <Link to="/" className="inline-flex items-center gap-2" aria-label="Flypnp home">
              <img src={images.logo} alt="" className="size-11 object-contain" />
              <span className="text-xl font-bold tracking-tight text-white">Flypnp</span>
            </Link>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              Memorable stays and local experiences, made for travelers who want to feel at home anywhere.
            </p>
            <p className="mt-5 inline-flex items-center gap-2 text-sm text-emerald-300">
              <MapPin className="size-4" /> Made with care in Switzerland
            </p>
          </div>

          <nav aria-label="Explore">
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-white">Explore</h2>
            <div className="mt-4 flex flex-col items-start gap-3 text-sm">
              <Link to="/" className="transition hover:text-emerald-300">Stays</Link>
              <Link to="/experiences" className="transition hover:text-emerald-300">Experiences</Link>
              <Link to="/services" className="transition hover:text-emerald-300">Services</Link>
              {user && <Link to="/wishlist" className="transition hover:text-emerald-300">Wishlist</Link>}
              {user && <Link to="/trips" className="transition hover:text-emerald-300">Trips</Link>}
            </div>
          </nav>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-white">Flypnp</h2>
            <div className="mt-4 flex flex-col items-start gap-3 text-sm">
              {user && <Link to="/profile" className="transition hover:text-emerald-300">My profile</Link>}
              <Link to="/gift-cards" className="transition hover:text-emerald-300">Gift cards</Link>
              <Link to="/help" className="transition hover:text-emerald-300">Help Center</Link>
              <a href={CONTACT_GMAIL_COMPOSE_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 transition hover:text-emerald-300"><Mail className="size-4" />Contact us</a>
              <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 transition hover:text-emerald-300"><FaInstagram className="size-4" />Instagram</a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-slate-800 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Flypnp. All rights reserved.</p>
          <p className="inline-flex items-center gap-1.5">Travel with an open mind <Heart className="size-3.5 fill-rose-500 text-rose-500" /></p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
