import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { NAV_ITEMS } from '../../data/content';
import { useActiveSection } from '../../hooks/useActiveSection';

const SECTION_IDS = NAV_ITEMS.map((n) => n.id);

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

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter] duration-300 ${
        scrolled && !open ? 'bg-black/70 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-[90rem] items-center justify-between px-5 sm:px-8 lg:h-[4.5rem]">
        <a href="#home" className="display relative z-10 text-[1.75rem] leading-none" onClick={() => setOpen(false)}>
          Coca-Cola <span className="font-sans text-sm font-medium tracking-normal opacity-80">concept</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => {
            const isActive = active === item.id;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={isActive ? 'location' : undefined}
                  className={`relative block rounded-full px-4 py-2 text-[0.95rem] font-medium transition-colors duration-200 ${
                    isActive ? 'bg-paper text-signal' : 'text-paper hover:bg-paper/15'
                  }`}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>

        <button
          ref={toggleRef}
          type="button"
          className="relative z-10 -mr-2 inline-flex h-12 w-12 items-center justify-center rounded-full md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X aria-hidden size={26} /> : <Menu aria-hidden size={26} />}
        </button>
      </nav>

      <div
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-0 bg-signal px-5 pt-24 pb-10 md:hidden"
      >
        <ul className="flex flex-col gap-1">
          {NAV_ITEMS.map((item, i) => (
            <li key={item.id}>
              <a
                ref={i === 0 ? firstLinkRef : undefined}
                href={`#${item.id}`}
                aria-current={active === item.id ? 'location' : undefined}
                onClick={() => setOpen(false)}
                className={`display block py-2 text-[clamp(3rem,15vw,4.5rem)] ${
                  active === item.id ? 'text-paper' : 'text-paper/55 hover:text-paper'
                }`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
