import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export const CLEAR_PROPS = "opacity,transform,visibility";

const MOTION_OK = "(prefers-reduced-motion: no-preference)";

// Must be called inside a useGSAP callback so the context reverts the matchMedia on unmount.
export function withMotion(setup: () => void) {
  gsap.matchMedia().add(MOTION_OK, setup);
}

export function prefersMotion() {
  return window.matchMedia(MOTION_OK).matches;
}

export function onceInView(trigger: Element, start = "top 85%") {
  return { scrollTrigger: { trigger, start, once: true } };
}

export { gsap, ScrollTrigger, useGSAP };
