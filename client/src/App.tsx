import { Footer } from './components/layout/Footer';
import { Nav } from './components/layout/Nav';
import { Stage } from './components/Stage';
import { useStageChoreography } from './hooks/useStageChoreography';
import { BrandMoments } from './sections/BrandMoments';
import { Contact } from './sections/Contact';
import { Experience } from './sections/Experience';
import { Hero } from './sections/Hero';
import { Products } from './sections/Products';
import { Story } from './sections/Story';
import { ExperienceProvider } from './state/ExperienceContext';

function Page() {
  useStageChoreography();
  return (
    <>
      <a
        href="#story"
        className="sr-only z-[60] rounded-full bg-paper px-4 py-2 text-signal focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <Nav />
      <Stage />
      <main>
        <Hero />
        <Story />
        <Products />
        <Experience />
        <BrandMoments />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <ExperienceProvider>
      <Page />
    </ExperienceProvider>
  );
}
