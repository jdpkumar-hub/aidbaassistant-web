import { AboutFounder } from "@/components/landing/AboutFounder";
import { Contact } from "@/components/landing/Contact";
import { DemoReport } from "@/components/landing/DemoReport";
import { Features } from "@/components/landing/Features";
import { Footer } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Navbar } from "@/components/landing/Navbar";
import { Pricing } from "@/components/landing/Pricing";
import { Testimonials } from "@/components/landing/Testimonials";

export default function Home() {
  return (
    <div className="min-h-screen bg-navy-950 text-foreground">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <DemoReport />
        <Pricing />
        <Testimonials />
        <AboutFounder />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
