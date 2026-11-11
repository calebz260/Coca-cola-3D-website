import { Mail, MapPin, Phone } from 'lucide-react';
import { CONTACT_DETAILS, NAV_ITEMS } from '../../data/content';

const SOCIAL = [
  { label: 'Instagram', href: 'https://www.instagram.com/' },
  { label: 'TikTok', href: 'https://www.tiktok.com/' },
  { label: 'YouTube', href: 'https://www.youtube.com/' },
  { label: 'X', href: 'https://x.com/' },
];

export function Footer() {
  return (
    <footer className="room bg-ink px-5 pt-20 pb-10 sm:px-8">
      <div className="mx-auto grid max-w-[90rem] gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="max-w-sm">
          <p className="display text-6xl">Coca-Cola</p>
          <p className="mt-4 text-paper/70">
            An interactive concept for the contour bottle, built with Three.js and React.
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="font-semibold">Explore</h2>
          <ul className="mt-4 space-y-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <a className="text-paper/70 transition-colors hover:text-paper" href={`#${item.id}`}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-semibold">Contact</h2>
          <ul className="mt-4 space-y-3 text-paper/70">
            <li className="flex items-start gap-3">
              <Mail aria-hidden size={18} className="mt-1 shrink-0" />
              <a className="break-words hover:text-paper" href={`mailto:${CONTACT_DETAILS.email}`}>
                {CONTACT_DETAILS.email}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Phone aria-hidden size={18} className="mt-1 shrink-0" />
              <a className="hover:text-paper" href={`tel:${CONTACT_DETAILS.phone.replace(/[^+\d]/g, '')}`}>
                {CONTACT_DETAILS.phone}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin aria-hidden size={18} className="mt-1 shrink-0" />
              <span>{CONTACT_DETAILS.address}</span>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-semibold">Follow</h2>
          <ul className="mt-4 space-y-2">
            {SOCIAL.map((s) => (
              <li key={s.label}>
                <a className="text-paper/70 transition-colors hover:text-paper" href={s.href} target="_blank" rel="noreferrer">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-16 flex max-w-[90rem] flex-col gap-3 border-t border-paper/15 pt-6 text-sm text-paper/60 md:flex-row md:justify-between">
        <p>© {new Date().getFullYear()} Contour concept studio.</p>
        <p>Independent concept project. Not affiliated with or endorsed by The Coca-Cola Company.</p>
      </div>
    </footer>
  );
}
