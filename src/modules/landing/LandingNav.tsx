import { HeadphonesLogo } from "./icons";
import type { LandingActions, SectionId } from "./types";

const LINKS: { id: SectionId; label: string }[] = [
  { id: "trilha", label: "Trilha" },
  { id: "recursos", label: "Recursos" },
  { id: "pratique", label: "Pratique" },
  { id: "como-funciona", label: "Como funciona" },
];

export function LandingNav({ onAuth, onNavigate }: LandingActions) {
  return (
    <header className="mm-nav" data-anim="nav">
      <div className="mm-container mm-nav-inner">
        <a
          href="#topo"
          className="mm-brand"
          style={{ fontSize: 21 }}
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <HeadphonesLogo />
          MusicMonster
        </a>

        <nav className="mm-nav-links" aria-label="Principal">
          {LINKS.map((link) => (
            <button key={link.id} type="button" className="mm-link" onClick={() => onNavigate(link.id)}>
              {link.label}
            </button>
          ))}
        </nav>

        <div className="mm-nav-actions">
          <button type="button" className="mm-btn mm-btn-ghost" onClick={() => onAuth("login")}>
            Entrar
          </button>
          <button
            type="button"
            className="mm-btn mm-btn-primary"
            style={{ fontSize: 15, padding: "12px 20px" }}
            onClick={() => onAuth("register")}
          >
            Começar agora
          </button>
        </div>
      </div>
    </header>
  );
}
