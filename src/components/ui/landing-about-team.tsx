import { cn } from "@/lib/utils";
import Image from "next/image";

export function LandingAboutTeam() {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-16 md:py-24">
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          About Our Mission
        </h2>
        <p className="mx-auto max-w-2xl text-muted-foreground md:text-lg">
          We are dedicated to bridging the digital divide across West Africa. Our platform empowers local WISPs and Hotspot operators to manage their revenue effectively, ensuring sustainable connectivity growth.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Team Member 1 */}
        <div className="group relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
          <div className="relative mb-6 aspect-square w-full overflow-hidden rounded-lg">
            <Image
              src="/team_member_1.png"
              alt="Network Engineer"
              fill
              className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <h3 className="text-xl font-bold">Aminata Diallo</h3>
          <p className="text-sm font-medium text-primary">Lead Network Engineer</p>
          <p className="mt-3 text-sm text-muted-foreground">
            Architecting robust wireless networks that can withstand the unique environmental challenges of the region.
          </p>
        </div>

        {/* Team Member 2 (Placeholder) */}
        <div className="group relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
          <div className="relative mb-6 aspect-square w-full overflow-hidden rounded-lg bg-muted flex items-center justify-center">
             <span className="text-muted-foreground font-mono">Image Pending</span>
          </div>
          <h3 className="text-xl font-bold">Dr. Ibrahim Sylla</h3>
          <p className="text-sm font-medium text-primary">Director of Operations</p>
          <p className="mt-3 text-sm text-muted-foreground">
            Ensuring smooth deployment and continuous uptime for all partner hotspots across our growing footprint.
          </p>
        </div>
        
        {/* Value Prop Card */}
        <div className="flex flex-col justify-center rounded-xl border border-primary/20 bg-primary/5 p-6 shadow-sm">
          <h3 className="mb-2 text-2xl font-bold text-primary">Join the Team</h3>
          <p className="mb-4 text-muted-foreground">
            We are always looking for passionate individuals who want to make a real impact in bringing internet access to everyone.
          </p>
          <button className="w-fit rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            View Openings
          </button>
        </div>
      </div>
    </section>
  );
}
