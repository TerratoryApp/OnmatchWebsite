import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Combo from "@/components/Combo";
import DemoConsole from "@/components/DemoConsole";
import HowItWorks from "@/components/HowItWorks";
import Compounding from "@/components/Compounding";
import Tools from "@/components/Tools";
import WhatItIsnt from "@/components/WhatItIsnt";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Nav />
      <Hero />
      <Combo />
      <DemoConsole />
      <HowItWorks />
      <Compounding />
      <Tools />
      <WhatItIsnt />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
