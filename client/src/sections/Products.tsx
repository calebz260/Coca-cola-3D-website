import { Box } from 'lucide-react';
import { BottleSilhouette } from '../components/BottleSilhouette';
import { Button } from '../components/ui/Button';
import { VARIANTS } from '../data/content';
import { useExperience } from '../state/ExperienceContext';

export function Products() {
  const { variant, setVariant } = useExperience();

  const seeIn3D = () => {
    document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section id="products" className="room bg-ink px-5 py-24 sm:px-8 md:py-36">
      <div className="mx-auto max-w-[90rem]">
        <div className="max-w-[38rem]">
          <h2 className="display text-h2">Pick a bottle</h2>
          <p className="mt-5 text-paper/75">
            Four flavours, one contour. Choose one to read about it, then see it in 3D.
          </p>
        </div>

        {/* The shelf: bottles stand on a single rail, like a cooler. */}
        <div className="mt-16 md:mt-24">
          <div
            role="group"
            aria-label="Flavours"
            className="grid grid-cols-2 items-end gap-x-4 gap-y-14 sm:grid-cols-4 sm:gap-x-6"
          >
            {VARIANTS.map((v) => {
              const selected = v.id === variant.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setVariant(v.id)}
                  className="group flex flex-col items-center rounded-2xl pt-2 pb-1 outline-offset-8"
                >
                  <span className="relative flex h-[clamp(11rem,40vw,20rem)] w-full items-end justify-center border-b-[6px] border-paper/15">
                    <span
                      aria-hidden
                      className={`absolute bottom-0 left-1/2 h-10 w-3/4 -translate-x-1/2 rounded-[50%] bg-signal blur-2xl transition-opacity duration-500 ${
                        selected ? 'opacity-60' : 'opacity-0'
                      }`}
                    />
                    <BottleSilhouette
                      variant={v}
                      className={`relative h-[92%] w-auto transition-transform duration-500 ease-[cubic-bezier(.2,.9,.3,1.3)] ${
                        selected ? '-translate-y-4' : 'group-hover:-translate-y-1.5'
                      }`}
                    />
                  </span>
                  <span
                    className={`mt-4 text-lg font-semibold transition-colors ${selected ? 'text-paper' : 'text-paper/55 group-hover:text-paper/85'}`}
                  >
                    {v.name}
                  </span>
                </button>
              );
            })}
          </div>

          <div
            aria-live="polite"
            className="mt-16 grid gap-8 border-t border-paper/15 pt-10 md:grid-cols-[1fr_1fr_auto] md:items-start md:gap-12"
          >
            <div>
              <h3 className="display text-[clamp(3rem,7vw,5rem)]">{variant.name}</h3>
            </div>
            <div className="max-w-[34rem]">
              <p className="text-paper/85">{variant.description}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {variant.notes.map((n) => (
                  <li key={n} className="rounded-full bg-paper/10 px-3.5 py-1.5 text-sm text-paper/85">
                    {n}
                  </li>
                ))}
              </ul>
            </div>
            <Button tone="red" onClick={seeIn3D} className="justify-self-start">
              <Box aria-hidden size={18} />
              See {variant.name} in 3D
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
