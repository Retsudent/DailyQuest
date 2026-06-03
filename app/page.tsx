import Navbar from "@/components/layout/navbar";
import Hero from "@/components/landing/hero";
import BeforeAfter from "@/components/landing/before-after";
import Features from "@/components/landing/features";
import Stats from "@/components/landing/stats";
import CTA from "@/components/landing/cta";
import Footer from "@/components/layout/footer";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050816]">
      <Navbar />

      <Hero />

      <BeforeAfter />

      <Stats />

      <Features />

      <CTA />

      <Footer />
    </main>
  );
}