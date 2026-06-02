import { Footer } from "@/components/landing/Footer";
import { Navbar } from "@/components/landing/Navbar";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-navy-950 text-foreground">
      <Navbar />
      <main className="pt-16">{children}</main>
      <Footer />
    </div>
  );
}
