import type { SectionId, StoryMoment, Variant } from '../types/content';

export const NAV_ITEMS: { id: SectionId; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'story', label: 'Our Story' },
  { id: 'products', label: 'Products' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
];

export const VARIANTS: Variant[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'The one everyone pictures. Caramel colour, a bright edge and a sharp, fine fizz.',
    notes: ['Bright and crisp', 'Full sugar', 'Best poured over ice'],
    label: '#E3101F',
    ink: '#FFFFFF',
    cap: '#E3101F',
    liquid: '#2a0c04',
  },
  {
    id: 'zero',
    name: 'Zero Sugar',
    description: 'The classic taste profile with no sugar. Same bottle, black label.',
    notes: ['Zero sugar', 'Classic profile', 'Same fine fizz'],
    label: '#0a0a0a',
    ink: '#E3101F',
    cap: '#1a1a1a',
    liquid: '#2a0c04',
  },
  {
    id: 'cherry',
    name: 'Cherry',
    description: 'A dark cherry note layered over the classic. Rounder and a little sweeter.',
    notes: ['Dark cherry', 'Rounder finish', 'Great with lime'],
    label: '#6E0B2A',
    ink: '#FFFFFF',
    cap: '#6E0B2A',
    liquid: '#2e0a08',
  },
  {
    id: 'vanilla',
    name: 'Vanilla',
    description: 'Soft vanilla over the classic. Think soda fountain float, without the scoop.',
    notes: ['Soft vanilla', 'Creamy finish', 'Pairs with dessert'],
    label: '#EFE2C6',
    ink: '#6B2A10',
    cap: '#C9A66B',
    liquid: '#301206',
  },
];

export const STORY: StoryMoment[] = [
  {
    year: '1886',
    title: 'The first glass',
    body: "A pharmacist in Atlanta mixes a new syrup with carbonated water. It is sold at Jacobs' Pharmacy for five cents a glass.",
  },
  {
    year: '1894',
    title: 'Into a bottle',
    body: 'A candy store owner in Vicksburg, Mississippi starts bottling the drink so it can travel beyond the soda fountain counter.',
  },
  {
    year: '1915',
    title: 'A shape you can feel',
    body: 'A glass company in Terre Haute, Indiana designs a bottle you could recognise in the dark, or broken on the ground. The contour bottle.',
  },
  {
    year: '2005',
    title: 'Zero sugar',
    body: 'The classic taste arrives with no sugar, in the same contour shape with a black label.',
  },
];

export const CONTACT_DETAILS = {
  email: 'hello@contour.example',
  phone: '+1 (555) 010-1886',
  address: 'Concept studio, remote',
};
