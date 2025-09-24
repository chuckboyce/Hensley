import Header from "@/components/header";
import Hero from "@/components/hero";
import Services from "@/components/services";
import About from "@/components/about";
// import FeaturedProperties from "@/components/featured-properties"; // Hidden until IDX approval
import Testimonials from "@/components/testimonials";
import ServiceArea from "@/components/service-area";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <Services />
        <About />
        {/* <FeaturedProperties /> */} {/* Hidden until IDX approval */}
        <Testimonials />
        <ServiceArea />
      </main>
      <Footer />
    </div>
  );
}
