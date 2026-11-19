import { HeadphonesLogo } from "./icons";
import type { LandingActions } from "./types";

export function LandingFooter({ onAuth, onNavigate }: LandingActions) {
  return (
    <footer className="mm-footer">
      <div className="mm-container mm-footer-inner">
        <div className="mm-brand" style={{ fontSize: 17 }}>
          <HeadphonesLogo size={24} />
          MusicMonster
        </div>
        <nav className="mm-footer-nav" aria-label="Rodapé">
          <button type="button" className="mm-link" onClick={() => onNavigate("trilha")}>
            Trilha
          </button>
          <button type="button" className="mm-link" onClick={() => onNavigate("recursos")}>
            Recursos
          </button>
          <button type="button" className="mm-link" onClick={() => onNavigate("pratique")}>
            Pratique
          </button>
          <button type="button" className="mm-link" onClick={() => onAuth("login")}>
            Entrar
          </button>
        </nav>
        <div className="mm-footer-copy">© {new Date().getFullYear()} MusicMonster</div>
      </div>
    </footer>
  );
}
