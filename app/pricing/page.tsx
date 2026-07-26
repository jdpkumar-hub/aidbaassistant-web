import { Navbar } from "@/components/landing/Navbar";
import { Pricing } from "@/components/landing/Pricing";
import { Contact } from "@/components/landing/Contact";
import { Footer } from "@/components/landing/Footer";

export default function PricingPage() {
  return (
    <>
      <Navbar />

      <main className="bg-slate-950">

        <Pricing />

        <Contact />

      </main>

      <Footer />
    </>
  );
}