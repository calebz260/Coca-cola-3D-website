import { Box, Snowflake, Sparkles } from 'lucide-react';
import { BottleSilhouette } from '../components/BottleSilhouette';
import { Button } from '../components/ui/Button';
import { VARIANTS } from '../data/content';
import { useExperience } from '../state/ExperienceContext';

/**
 * "Pick a bottle": the flavour details and the 3D controls share one block (#experience),
 * with the 3D bottle standing in its left column, and the four flavours as cards below.
 */
export function Products() {
  const { variant, setVariant, chilled, setChilled, shake, shakeCount } = useExperience();

  const seeIn3D = () => {
    document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section id="products" className="relative bg-ink">
      {/* Opaque band: the bottle travels in behind the heading rather than across it. */}
      <div className="room bg-ink">
        <div className="mx-auto max-w-[90rem] px-5 pt-24 pb-2 sm:px-8 md:pt-32 lg:px-[3.75rem]">
          <h2 className="display text-[clamp(3rem,6vw,5rem)]">Pick a bottle</h2>
          <p className="mt-5 max-w-[30rem] text-paper/70">
            Four flavours, one contour. Choose one to read about it, then see it in 3D.
          </p>
        </div>
      </div>

      <div id="experience" aria-describedby="experience-hint" className="relative">
        {/* Stage light behind the bottle. Painted below the canvas. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[55svh] bg-[radial-gradient(ellipse_34%_46%_at_50%_52%,rgba(229,17,46,0.42),transparent_72%)] lg:inset-y-0 lg:h-auto lg:bg-[radial-gradient(ellipse_19%_36%_at_27%_50%,rgba(229,17,46,0.4),transparent_72%)]"
        />

        <div className="mx-auto grid max-w-[90rem] px-5 sm:px-8 lg:min-h-[100svh] lg:grid-cols-2 lg:gap-12 lg:px-[3.75rem]">
          {/* Where the 3D bottle stands. */}
          <div aria-hidden className="h-[55svh] lg:h-auto lg:border-b lg:border-paper/15" />

          <div className="above-stage pointer-events-none flex flex-col justify-center py-10 lg:py-20">
            <div className="pointer-events-auto">
              <h3 className="display text-[clamp(4rem,8vw,7rem)] leading-[0.85]">{variant.name}</h3>
              <p className="mt-6 max-w-[27rem] text-lg leading-relaxed text-paper/85">{variant.description}</p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {variant.notes.map((n) => (
                  <li key={n} className="rounded-full px-4 py-1.5 text-sm text-paper/90 ring-1 ring-paper/30">
                    {n}
                  </li>
                ))}
              </ul>
              <Button tone="red" onClick={seeIn3D} className="mt-7">
                <Box aria-hidden size={18} />
                See {variant.name} in 3D
              </Button>
            </div>

            <div className="mt-10 border-t border-paper/15 pt-8">
              <h3 className="display text-[clamp(2.25rem,3.4vw,2.75rem)]">Pick it up</h3>
              <p id="experience-hint" className="mt-3 max-w-[28rem] text-paper/70">
                Drag the bottle to spin it. Shake it to wake the bubbles, chill it and watch the glass bead up.
              </p>

              <fieldset className="pointer-events-auto mt-6">
                <legend className="mb-3 text-sm font-semibold">Flavour</legend>
                <div className="flex flex-wrap gap-2">
                  {VARIANTS.map((v) => {
                    const selected = v.id === variant.id;
                    return (
                      <label
                        key={v.id}
                        className={`flex min-h-11 cursor-pointer items-center gap-2.5 rounded-full py-2 pr-4 pl-3 text-[0.95rem] font-medium ring-1 transition-colors has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-paper ${
                          selected ? 'bg-paper/15 ring-paper/70' : 'ring-paper/25 hover:ring-paper/60'
                        }`}
                      >
                        <input
                          type="radio"
                          name="flavour"
                          value={v.id}
                          checked={selected}
                          onChange={() => setVariant(v.id)}
                          className="sr-only"
                        />
                        <span
                          aria-hidden
                          className="h-3.5 w-3.5 rounded-full ring-1 ring-paper/40"
                          style={{
                            background: v.id === 'vanilla' ? '#C9A66B' : v.label,
                          }}
                        />
                        {v.name}
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <div className="pointer-events-auto mt-5 flex flex-wrap items-center gap-3">
                <Button tone="red" onClick={shake}>
                  <Sparkles aria-hidden size={18} />
                  Shake it
                </Button>
                <button
                  type="button"
                  role="switch"
                  aria-checked={chilled}
                  onClick={() => setChilled(!chilled)}
                  className="inline-flex min-h-12 items-center gap-3 rounded-full py-2 pr-2.5 pl-4 font-semibold ring-1 ring-paper/30 transition-colors hover:ring-paper/70"
                >
                  <Snowflake aria-hidden size={18} />
                  Chilled
                  <span
                    aria-hidden
                    className={`relative h-7 w-12 rounded-full transition-colors ${chilled ? 'bg-signal' : 'bg-paper/25'}`}
                  >
                    <span
                      className={`absolute top-1 left-1 h-5 w-5 rounded-full bg-paper transition-transform ${chilled ? 'translate-x-5' : ''}`}
                    />
                  </span>
                </button>
              </div>

              <p className="sr-only" aria-live="polite">
                {variant.name} selected. {chilled ? 'Bottle chilled.' : 'Bottle at room temperature.'}
                {shakeCount > 0 ? ` Shaken ${shakeCount} ${shakeCount === 1 ? 'time' : 'times'}.` : ''}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* The four flavours as cards. Opaque, so they sit cleanly above the stage. */}
      <div className="above-stage mx-auto max-w-[90rem] px-5 pt-14 pb-24 sm:px-8 md:pb-32 lg:px-[3.75rem]">
        <div role="group" aria-label="Flavours" className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {VARIANTS.map((v) => {
            const selected = v.id === variant.id;
            return (
              <button
                key={v.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setVariant(v.id)}
                className="group relative flex flex-col items-center overflow-hidden rounded-lg bg-panel px-4 pt-6 pb-7 transition-colors hover:bg-[#15191d]"
              >
                <span className="relative flex h-[clamp(7rem,16vw,11rem)] items-end justify-center">
                  <span
                    aria-hidden
                    className={`absolute inset-x-[-30%] bottom-[10%] top-[20%] rounded-[50%] bg-signal blur-2xl transition-opacity duration-500 ${
                      selected ? 'opacity-25' : 'opacity-0'
                    }`}
                  />
                  <BottleSilhouette
                    variant={v}
                    className={`relative h-full w-auto transition-transform duration-500 ease-[cubic-bezier(.2,.9,.3,1.3)] ${
                      selected ? '-translate-y-1' : 'group-hover:-translate-y-1'
                    }`}
                  />
                </span>
                <span className="mt-5 font-semibold">{v.name}</span>
                <span
                  aria-hidden
                  className={`absolute inset-x-3 bottom-0 h-1 rounded-full transition-colors duration-300 ${
                    selected ? 'bg-signal' : 'bg-paper/20 group-hover:bg-paper/40'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
