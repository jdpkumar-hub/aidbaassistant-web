import { AboutFounder } from "@/components/landing/AboutFounder";
import { Contact } from "@/components/landing/Contact";
import { Features } from "@/components/landing/Features";
import { Footer } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Navbar } from "@/components/landing/Navbar";
import { Pricing } from "@/components/landing/Pricing";

export default function Home() {
  return (
    <div className="min-h-screen bg-navy-950 text-foreground">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Pricing />
        <AboutFounder />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
