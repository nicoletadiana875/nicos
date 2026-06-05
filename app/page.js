import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import Hero from "@/components/site/Hero";
import About from "@/components/site/About";
import Services from "@/components/site/Services";
import Markets from "@/components/site/Markets";
import WhyChooseMe from "@/components/site/WhyChooseMe";
import Contact from "@/components/site/Contact";
import WhatsAppFloat from "@/components/site/WhatsAppFloat";

function LiquidGlassFilter() {
  return (
    <div
      aria-hidden="true"
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden", pointerEvents: "none" }}
      dangerouslySetInnerHTML={{
        __html: `<svg xmlns="http://www.w3.org/2000/svg">
<defs>
<filter id="liquid-glass-filter" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">
<feTurbulence type="fractalNoise" baseFrequency="0.055 0.055" numOctaves="1" seed="3" result="noise"/>
<feGaussianBlur in="noise" stdDeviation="1.5" result="blurred"/>
<feDisplacementMap in="SourceGraphic" in2="blurred" scale="55" xChannelSelector="R" yChannelSelector="B" result="displaced"/>
<feGaussianBlur in="displaced" stdDeviation="3" result="final"/>
<feComposite in="final" in2="final" operator="over"/>
</filter>
</defs>
</svg>`,
      }}
    />
  );
}

export default function HomePage() {
  return (
    <>
      <LiquidGlassFilter />
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        <Markets />
        <WhyChooseMe />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
