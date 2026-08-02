import { HeroSection } from "@/components/ui/hero-3";
import { Header } from "@/components/ui/header-3";
import { LandingSalesperson } from "@/components/ui/landing-salesperson";
import { LandingAboutTeam } from "@/components/ui/landing-about-team";
import { LandingImpact } from "@/components/ui/landing-impact";

export default function DemoOne() {
	return (
		<div className="flex w-full min-h-screen flex-col">
		  <Header />
		  <main className="grow overflow-hidden" >
			<HeroSection />
      <LandingSalesperson />
      <LandingImpact />
      <LandingAboutTeam />
	      </main>
	   </div>
  );
}
