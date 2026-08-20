import { MotionConfig } from "framer-motion";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Work } from "./components/Work";
import { Method } from "./components/Method";
import { Configurator } from "./components/Configurator";
import { Team, Beliefs, Faq } from "./components/Sections";
import { Start, Footer } from "./components/Start";

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-bone focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-ink"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Work />
        <Method />
        <Configurator />
        <Team />
        <Beliefs />
        <Faq />
        <Start />
      </main>
      <Footer />
    </MotionConfig>
  );
}
