// types/header.types.ts
export interface NavItem {
  id: string;
  label: string;
}

export interface EventItem {
  id: number;
  game: string;
  title: string;
  date: string;
  prize: string;
}

export interface SocialLink {
  platform: string;
  icon: string;
  url: string;
}
