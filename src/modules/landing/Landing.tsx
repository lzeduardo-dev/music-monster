import { useCallback, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthModal from "../../components/AuthModal.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { CLEAR_PROPS, ScrollTrigger, gsap, onceInView, useGSAP, withMotion } from "./gsap";
import { LandingNav } from "./LandingNav";
import { Hero } from "./Hero";
import { TopicsMarquee } from "./TopicsMarquee";
import { Stats } from "./Stats";
import { Trail } from "./Trail";
import { Features } from "./Features";
import { FretboardDemo } from "./FretboardDemo";
import { HowItWorks } from "./HowItWorks";
import { FinalCta } from "./FinalCta";
import { LandingFooter } from "./LandingFooter";
import type { AuthMode, SectionId } from "./types";
import "./landing.css";

export default function Landing() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth() as { isAuthenticated: boolean };
  const root = useRef<HTMLDivElement>(null);

  // PrivateRoute sends logged-out visitors here with state.from; open the login straight away.
  const [authMode, setAuthMode] = useState<AuthMode | null>(() =>
    (location.state as { from?: unknown } | null)?.from ? "login" : null,
  );

  const openAuth = useCallback(
    (mode: AuthMode) => {
      if (isAuthenticated) navigate("/inicio");
      else setAuthMode(mode);
    },
    [isAuthenticated, navigate],
  );

  const scrollToSection = useCallback((id: SectionId) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useGSAP(
    () => {
      withMotion(() => {
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from('[data-anim="nav"]', { y: -24, autoAlpha: 0, duration: 0.6, clearProps: CLEAR_PROPS })
          .from('[data-anim="hero-line"]', { yPercent: 115, duration: 1.05, stagger: 0.12, clearProps: CLEAR_PROPS }, "-=0.25")
          .from('[data-anim="hero-fade"]', { y: 24, autoAlpha: 0, duration: 0.7, stagger: 0.08, clearProps: CLEAR_PROPS }, "-=0.7");

        gsap.utils.toArray<HTMLElement>('[data-anim="reveal"]').forEach((el) => {
          gsap.from(el, { y: 48, autoAlpha: 0, duration: 0.95, ease: "power3.out", clearProps: CLEAR_PROPS, ...onceInView(el) });
        });

        gsap.utils.toArray<HTMLElement>('[data-anim="stagger"]').forEach((box) => {
          gsap.from(box.children, {
            y: 40,
            autoAlpha: 0,
            duration: 0.85,
            ease: "power3.out",
            stagger: 0.1,
            clearProps: CLEAR_PROPS,
            ...onceInView(box),
          });
        });
      });

      // Geist swaps in after first paint and shifts layout, so trigger positions need recalculating.
      document.fonts?.ready.then(() => ScrollTrigger.refresh());
    },
    { scope: root },
  );

  const actions = { onAuth: openAuth, onNavigate: scrollToSection };

  return (
    <div ref={root} className="mm-landing">
      <LandingNav {...actions} />
      <Hero {...actions} />
      <TopicsMarquee />
      <Stats />
      <Trail />
      <Features />
      <FretboardDemo />
      <HowItWorks />
      <FinalCta onAuth={openAuth} />
      <LandingFooter {...actions} />

      {authMode && (
        <AuthModal key={authMode} initialMode={authMode} onClose={() => setAuthMode(null)} />
      )}
    </div>
  );
}
