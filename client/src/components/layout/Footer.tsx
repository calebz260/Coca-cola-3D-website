import { Mail, MapPin, Phone } from 'lucide-react';
import { FooterBackgroundGradient, TextHoverEffect } from '@/components/ui/hover-footer';
import { CONTACT_DETAILS, NAV_ITEMS } from '../../data/content';
import { SOCIAL_LINKS } from '../ui/SocialIcons';

const linkClass = 'text-paper/70 transition-colors hover:text-signal';

const CONTACT = [
  { Icon: Mail, text: CONTACT_DETAILS.email, href: `mailto:${CONTACT_DETAILS.email}` },
  { Icon: Phone, text: CONTACT_DETAILS.phone, href: `tel:${CONTACT_DETAILS.phone.replace(/[^+\d]/g, '')}` },
  { Icon: MapPin, text: CONTACT_DETAILS.address },
];

export function Footer() {
  return (
    <footer className="room overflow-hidden bg-ink px-5 pt-20 sm:px-8 lg:px-[3.75rem]">
      {/* A low red glow rising from the bottom edge. */}
      <FooterBackgroundGradient background="radial-gradient(120% 110% at 50% 0%, transparent 55%, rgba(229,17,46,0.2) 100%)" />

      <div className="relative z-10 mx-auto grid max-w-[90rem] gap-12 md:grid-cols-[1fr_auto] md:gap-16">
        <div className="max-w-sm">
          <p className="script text-[clamp(3.25rem,6vw,4.25rem)] text-signal">Coca-Cola</p>
          <p className="mt-5 text-[0.98rem] text-paper/70">
            An interactive concept for the contour bottle, built with Three.js and React.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-12 gap-y-10 text-[0.98rem] sm:grid-cols-3 lg:gap-x-16">
          <nav aria-label="Footer">
            <h2 className="font-semibold">Explore</h2>
            <ul className="mt-5 space-y-3">
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <a className={linkClass} href={`#${item.id}`}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-semibold">Contact</h2>
            <ul className="mt-5 space-y-3">
              {CONTACT.map(({ Icon, text, href }) => (
                <li key={text} className="flex items-start gap-2.5">
                  <Icon aria-hidden size={16} className="mt-[0.3rem] shrink-0 text-signal" />
                  {href ? (
                    <a className={`${linkClass} break-words`} href={href}>
                      {text}
                    </a>
                  ) : (
                    <span className="text-paper/70">{text}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-semibold">Follow</h2>
            <ul className="mt-5 space-y-3">
              {SOCIAL_LINKS.map((s) => (
                <li key={s.label}>
                  <a className={linkClass} href={s.href} target="_blank" rel="noreferrer">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto mt-16 flex max-w-[90rem] flex-col gap-3 border-t border-paper/15 pt-6 pb-10 text-sm text-paper/60 md:flex-row md:justify-between lg:pb-0">
        <p>© {new Date().getFullYear()} Contour concept studio.</p>
        <p>Independent concept project. Not affiliated with or endorsed by The Coca-Cola Company.</p>
      </div>

      {/* The signature: the script mark drawn in red outline, lit up in warm white where the cursor passes. Desktop only: it is a hover effect. */}
      <div className="relative z-10 mx-auto -mt-16 -mb-28 hidden h-[30rem] max-w-[90rem] lg:block">
        <TextHoverEffect
          text="Coca-Cola"
          duration={0.25}
          className="normal-case"
          fontClassName="font-script text-[62px]"
          outlineClassName="stroke-paper/40"
          drawClassName="stroke-signal/80"
          gradientStops={['#ffffff', '#ffe3d6', '#ffb3a8', '#ffe3d6', '#ffffff']}
        />
      </div>
    </footer>
  );
}
