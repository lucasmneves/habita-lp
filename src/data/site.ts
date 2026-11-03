import { appLinks } from './appLinks';

// Ativa o endereço HTTPS quando configurado. Preserva o esquema atual até existir um domínio real.
export const site = { appDeepLink: appLinks.appUrl || appLinks.scheme, privacyUrl: '', socialLinks: [] as { label: string; url: string }[] };
export const journey = [
  { id: 'inicio', mood: 'happy', stage: 1, phrase: 'Toda grande mudança começa pequena.' },
  { id: 'como-funciona', mood: 'neutral', stage: 2, phrase: 'Um hábito de cada vez.' },
  { id: 'evolua', mood: 'proud', stage: 3, phrase: 'Consistência é melhor que perfeição.' },
  { id: 'aplicativo', mood: 'happy', stage: 3, phrase: 'Bora transformar intenção em ação?' },
  { id: 'jornada', mood: 'proud', stage: 4, phrase: 'Pequenos passos também levam longe.' },
  { id: 'comece', mood: 'excited', stage: 4, phrase: 'Continue crescendo. Estou com você!' },
] as const;
