import { useLayoutEffect, useRef, type ReactNode } from "react";
import { animate, motion, useReducedMotion } from "framer-motion";

const selectors = [
  "main > section",
  "main > div > section",
  "main > div > aside",
].join(",");

const shouldAnimate = (element: HTMLElement) =>
  !element.dataset.motionRevealed
  && !element.closest("[role='dialog']")
  && !element.classList.contains("animate-pulse")
  && getComputedStyle(element).position !== "fixed";

const revealElement = (element: HTMLElement) => {
  element.dataset.motionRevealed = "true";
  element.style.opacity = "0";
  element.style.transform = "translate3d(0, 10px, 0)";
  element.style.willChange = "transform, opacity";

  animate(
    element,
    {
      opacity: [0, 1],
      transform: ["translate3d(0, 10px, 0)", "translate3d(0, 0, 0)"],
    },
    {
      duration: 0.34,
      ease: [0.16, 1, 0.3, 1],
      onComplete: () => {
        requestAnimationFrame(() => {
          element.style.removeProperty("transform");
          element.style.removeProperty("will-change");
          element.style.opacity = "1";
        });
      },
    },
  );
};

const useSubtleScrollReveals = (
  rootRef: React.RefObject<HTMLDivElement | null>,
  reducedMotion: boolean | null,
) => {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          revealElement(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -4% 0px" },
    );

    const register = (container: ParentNode) => {
      Array.from(container.querySelectorAll<HTMLElement>(selectors)).forEach((element) => {
        if (shouldAnimate(element)) observer.observe(element);
      });
    };

    register(root);
    const mutations = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          if (node.matches(selectors) && shouldAnimate(node)) observer.observe(node);
          register(node);
        });
      });
    });
    mutations.observe(root, { childList: true, subtree: true });

    return () => {
      mutations.disconnect();
      observer.disconnect();
    };
  }, [reducedMotion, rootRef]);
};

const MotionScene = ({ children }: { children: ReactNode }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useSubtleScrollReveals(rootRef, reducedMotion);

  return (
    <motion.div
      ref={rootRef}
      initial={reducedMotion ? false : { opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reducedMotion ? undefined : { opacity: 0 }}
      transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
};

export default MotionScene;
