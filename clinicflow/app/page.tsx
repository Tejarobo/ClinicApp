import HomeNavbar from "@/components/home/HomeNavbar";
import HeroSection from "@/components/home/HeroSection";
import WorkflowSection from "@/components/home/WorkflowSection";
import AboutDoctorSection from "@/components/home/AboutDoctorSection";
import FAQSection from "@/components/home/FAQSection";
import CTABanner from "@/components/home/CTABanner";

export default function HomePage() {
  return (
    <main>
      <HomeNavbar />
      <HeroSection />
      <WorkflowSection />
      <AboutDoctorSection />
      <FAQSection />
      <CTABanner />
    </main>
  );
}

