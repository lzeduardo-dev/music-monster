export type AuthMode = "login" | "register";

export type SectionId = "trilha" | "recursos" | "pratique" | "como-funciona";

export interface LandingActions {
  onAuth: (mode: AuthMode) => void;
  onNavigate: (id: SectionId) => void;
}
