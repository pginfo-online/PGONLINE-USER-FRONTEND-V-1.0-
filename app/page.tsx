import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import AppPromotion from "../components/AppPromotion";
import CategorySection from "../components/CategorySection";
import WhyChooseUs from "../components/WhyChooseUs";
import RecommendedPGs from "../components/RecommendedPGs";
import TrustStats from "../components/TrustStats";
import TenantOwnerSection from "../components/TenantOwnerSection";
import Testimonials from "../components/Testimonials";
import FinalCTA from "../components/FinalCTA";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      
      <main className="flex-1 w-full bg-[var(--color-brand-bg)]">
        <Hero />
        
        <div className="space-y-16 lg:space-y-24 mb-16 lg:mb-24">
          <AppPromotion />
          <CategorySection />
          <WhyChooseUs />
          <RecommendedPGs />
          <TrustStats />
          <TenantOwnerSection />
          <Testimonials />
          <FinalCTA />
        </div>
      </main>

      <Footer />
    </>
  );
}
