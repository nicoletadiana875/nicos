import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import Hero from "@/components/site/Hero";
import About from "@/components/site/About";
import Services from "@/components/site/Services";
import Markets from "@/components/site/Markets";
import WhyChooseMe from "@/components/site/WhyChooseMe";
import Contact from "@/components/site/Contact";
import WhatsAppFloat from "@/components/site/WhatsAppFloat";

export default function HomePage() {
  return (
    <>
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
