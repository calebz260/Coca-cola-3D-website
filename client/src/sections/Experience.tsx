import { Snowflake, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { VARIANTS } from '../data/content';
import { useExperience } from '../state/ExperienceContext';

export function Experience() {
  const { variant, setVariant, chilled, setChilled, shake, shakeCount } = useExperience();

  return (
    <section
      id="experience"
      className="relative min-h-[100svh] overflow-hidden bg-ink"
      aria-describedby="experience-hint"
    >
      {/* Stage light: a red pool under the bottle. Painted below the canvas. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_45%_55%_at_50%_82%,rgba(227,16,31,0.55),transparent_70%)] lg:bg-[radial-gradient(ellipse_32%_60%_at_35%_80%,rgba(227,16,31,0.55),transparent_70%)]"
      />

      <div className="above-stage mx-auto flex min-h-[100svh] max-w-[90rem] flex-col justify-end px-5 pt-24 pb-8 sm:px-8 lg:justify-center lg:py-24">
        <div className="pointer-events-none lg:ml-auto lg:w-[min(30rem,42%)]">
          <h2 className="display text-h2">Pick it up</h2>
          <p id="experience-hint" className="mt-4 max-w-[30rem] text-paper/80">
            Drag the bottle to spin it. Shake it to wake the bubbles, chill it and watch the glass bead up.
          </p>

          <fieldset className="pointer-events-auto mt-8">
            <legend className="mb-3 font-semibold">Flavour</legend>
            <div className="flex flex-wrap gap-2">
              {VARIANTS.map((v) => {
                const selected = v.id === variant.id;
                return (
                  <label
                    key={v.id}
                    className={`flex min-h-11 cursor-pointer items-center gap-2.5 rounded-full py-2 pr-4 pl-2.5 text-[0.95rem] font-medium ring-1 transition-colors has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-paper ${
                      selected ? 'bg-paper text-ink ring-paper' : 'text-paper ring-paper/30 hover:ring-paper/70'
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
                      className="h-5 w-5 rounded-full ring-1 ring-black/20"
                      style={{ background: v.label }}
                    />
                    {v.name}
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="pointer-events-auto mt-6 flex flex-wrap items-center gap-3">
            <Button tone="red" onClick={shake}>
              <Sparkles aria-hidden size={18} />
              Shake it
            </Button>
            <button
              type="button"
              role="switch"
              aria-checked={chilled}
              onClick={() => setChilled(!chilled)}
              className="inline-flex min-h-12 items-center gap-3 rounded-full px-4 py-2 font-semibold ring-1 ring-paper/30 transition-colors hover:ring-paper/70"
            >
              <Snowflake aria-hidden size={18} />
              Chilled
              <span
                aria-hidden
                className={`relative h-6 w-11 rounded-full transition-colors ${chilled ? 'bg-signal' : 'bg-paper/25'}`}
              >
                <span
                  className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-paper transition-transform ${chilled ? 'translate-x-5' : ''}`}
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
    </section>
  );
}
