export type VariantId = 'classic' | 'zero' | 'cherry' | 'vanilla';

export interface Variant {
  id: VariantId;
  name: string;
  description: string;
  notes: string[];
  /** Label background colour. */
  label: string;
  /** Label type and ribbon colour. */
  ink: string;
  cap: string;
  liquid: string;
}

export interface StoryMoment {
  year: string;
  title: string;
  body: string;
}

export type SectionId = 'home' | 'story' | 'products' | 'experience' | 'contact';

export interface ContactPayload {
  fullName: string;
  email: string;
  subject: string;
  message: string;
  /** Honeypot. Real visitors never see or fill this field. */
  company?: string;
}

export type ContactFieldErrors = Partial<Record<keyof ContactPayload, string>>;
