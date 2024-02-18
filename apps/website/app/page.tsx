'use client';

import Features from '@/app/_components/features';
import Footer from '@/app/_components/footer';
import Hero from '@/app/_components/hero';
import Pricing from '@/app/_components/pricing';
import Testimonials from '@/app/_components/testimonials';

export default function Page() {
  return (
    <div className="wrapper">
      <Hero />
      <Features />
      <Pricing />
      <Testimonials />
      <Footer />
    </div>
  );
}
