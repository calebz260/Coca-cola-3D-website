import { CONTACT_DETAILS, NAV_ITEMS } from '../../data/content';
import { SOCIAL_LINKS } from '../ui/SocialIcons';

const linkClass = 'text-paper/70 transition-colors hover:text-paper';

export function Footer() {
  return (
    <footer className="room bg-ink px-5 pt-20 pb-10 sm:px-8 lg:px-[3.75rem]">
      <div className="mx-auto grid max-w-[90rem] gap-12 md:grid-cols-[1fr_auto] md:gap-16">
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
              <li>
                <a className={`${linkClass} break-words`} href={`mailto:${CONTACT_DETAILS.email}`}>
                  {CONTACT_DETAILS.email}
                </a>
              </li>
              <li>
                <a className={linkClass} href={`tel:${CONTACT_DETAILS.phone.replace(/[^+\d]/g, '')}`}>
                  {CONTACT_DETAILS.phone}
                </a>
              </li>
              <li className="text-paper/70">{CONTACT_DETAILS.address}</li>
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

      <div className="mx-auto mt-16 flex max-w-[90rem] flex-col gap-3 border-t border-paper/15 pt-6 text-sm text-paper/60 md:flex-row md:justify-between">
        <p>© {new Date().getFullYear()} Contour concept studio.</p>
        <p>Independent concept project. Not affiliated with or endorsed by The Coca-Cola Company.</p>
      </div>
    </footer>
  );
}
