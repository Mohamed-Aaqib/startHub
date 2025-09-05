import FAQ from '@/components/mainPage/FAQ';
import Features from '@/components/mainPage/Features';
import Hero from '@/components/mainPage/Hero';

export default function Home() {

  return (
    <div className="w-full h-full">
      <Hero/>
      <Features/>
      <FAQ/>
    </div>
  );
}
