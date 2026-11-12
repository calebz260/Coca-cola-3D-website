import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { NAV_ITEMS } from '../../data/content';
import { useActiveSection } from '../../hooks/useActiveSection';
import { SOCIAL_LINKS } from '../ui/SocialIcons';

const SECTION_IDS = NAV_ITEMS.map((n) => n.id);

/** The round red badge with the script mark, top left of every page. */
function Badge() {
  return (
    <span
      aria-hidden
      className="script flex h-12 w-12 items-center justify-center rounded-full bg-signal pb-1 text-center text-[0.95rem] leading-[0.8] text-paper lg:h-14 lg:w-14 lg:text-[1.05rem]"
    >
      Coca-
      <br />
      Cola
    </span>
  );
}

export function Nav() {
  const active = useActiveSection(SECTION_IDS);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Mobile menu: lock page scroll, close on Escape, move focus in and back out.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    firstLinkRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
      toggleRef.current?.focus();
    };
  }, [open]);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const close = () => mq.matches && setOpen(false);
    mq.addEventListener('change', close);
    return () => mq.removeEventListener('change', close);
  }, []);

  const socials = SOCIAL_LINKS.filter((s) => s.Icon);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter] duration-300 ${
        scrolled && !open ? 'bg-ink/75 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <nav
        aria-label="Main"
        className="mx-auto grid h-[4.5rem] max-w-[90rem] grid-cols-[auto_1fr_auto] items-center gap-6 px-5 sm:px-8 lg:h-24 lg:px-[3.75rem]"
      >
        <a href="#home" className="relative z-10 rounded-full" onClick={() => setOpen(false)}>
          <Badge />
          <span className="sr-only">Coca-Cola concept, home</span>
        </a>

        <ul className="hidden items-center justify-center gap-2 md:flex lg:gap-4">
          {NAV_ITEMS.map((item) => {
            const isActive = active === item.id;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={isActive ? 'location' : undefined}
                  className={`block rounded-full px-3 py-2 text-[0.95rem] transition-colors duration-200 ${
                    isActive ? 'font-semibold text-paper' : 'font-medium text-paper/70 hover:text-paper'
                  }`}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>

        <ul className="hidden items-center gap-1 md:flex">
          {socials.map(({ label, href, Icon }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full text-paper/85 transition-colors hover:bg-paper/10 hover:text-paper"
              >
                {Icon && <Icon />}
              </a>
            </li>
          ))}
        </ul>

        <button
          ref={toggleRef}
          type="button"
          className="relative z-10 col-start-3 -mr-2 inline-flex h-12 w-12 items-center justify-center rounded-full md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X aria-hidden size={26} /> : <Menu aria-hidden size={26} />}
        </button>
      </nav>

      <div id="mobile-menu" hidden={!open} className="fixed inset-0 bg-cellar px-5 pt-28 pb-10 md:hidden">
        <ul className="flex flex-col gap-1">
          {NAV_ITEMS.map((item, i) => (
            <li key={item.id}>
              <a
                ref={i === 0 ? firstLinkRef : undefined}
                href={`#${item.id}`}
                aria-current={active === item.id ? 'location' : undefined}
                onClick={() => setOpen(false)}
                className={`display block py-2 text-[clamp(3rem,15vw,4.5rem)] ${
                  active === item.id ? 'text-signal' : 'text-paper hover:text-signal'
                }`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <ul className="mt-10 flex gap-2">
          {socials.map(({ label, href, Icon }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="inline-flex h-12 w-12 items-center justify-center rounded-full ring-1 ring-paper/25"
              >
                {Icon && <Icon />}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
