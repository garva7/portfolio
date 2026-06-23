import { useCallback, useState } from "react";
import Backdrop from "./components/Backdrop";
import Loader from "./components/Loader";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Projects from "./components/Projects";
import About from "./components/About";
import Stack from "./components/Stack";
import Experience from "./components/Experience";
import Services from "./components/Services";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function App() {
  const [ready, setReady] = useState(false);
  const handleDone = useCallback(() => setReady(true), []);

  return (
    <div className="relative min-h-[100dvh]">
      {!ready && <Loader onDone={handleDone} />}
      <Backdrop />
      <Navbar />
      <main className="relative">
        <Hero />
        <Projects />
        <Services />
        <About />
        <Experience />
        <Stack />
        <Contact />
      </main>
      <Footer />
      
    </div>
  );
}
