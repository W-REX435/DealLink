import type { Variants } from 'framer-motion';

/** DealLink signature easing (VantLaunch curve) */
export const EASE = [0.16, 1, 0.3, 1] as const;

/** CreatorLab-style easeOutExpo */
export const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const;

/** Blur-fade reveal used on hero headline lines */
export const blurReveal = (delay = 0): Variants => ({
  hidden: { opacity: 0, y: 24, filter: 'blur(12px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: EASE, delay },
  },
});

/** Standard scroll-reveal */
export const fadeUp = (delay = 0, y = 24): Variants => ({
  hidden: { opacity: 0, y },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE, delay },
  },
});

/** Parent container staggering children */
export const stagger = (staggerChildren = 0.1, delayChildren = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren, delayChildren } },
});
