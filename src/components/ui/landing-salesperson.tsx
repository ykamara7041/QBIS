import { cn } from "@/lib/utils";
import { TrophyIcon, TrendingUpIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import * as motion from "framer-motion/client";

export function LandingSalesperson() {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-16 md:py-24">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
        viewport={{ once: true }}
        className="relative mx-auto max-w-3xl overflow-hidden rounded-2xl border bg-card p-8 shadow-2xl dark:inset-shadow-foreground/10 dark:inset-shadow-xs"
      >
        {/* Glow effect */}
        <div className="absolute -top-24 -right-24 -z-10 size-64 rounded-full bg-[radial-gradient(ellipse_at_center,theme(--color-primary/.15),transparent,transparent)] blur-3xl" />
        
        <div className="flex flex-col gap-8 md:flex-row md:items-center">
          <div className="relative mx-auto size-40 shrink-0 md:size-48">
            <Image
              src="/sales_rep.png"
              alt="Top Salesperson of the Week"
              fill
              className="rounded-full object-cover object-top ring-4 ring-primary/20 shadow-xl"
            />
            <div className="absolute -bottom-3 -right-3 flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
              <TrophyIcon className="size-6" />
            </div>
          </div>

          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <StarIcon className="size-3 fill-primary" />
              TOP SALESPERSON OF THE WEEK
            </div>
            
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Emmanuel Kourouma
            </h2>
            
            <p className="text-muted-foreground md:text-lg">
              Emmanuel led our N'Zelekore division with an astonishing performance this week, connecting local businesses and deploying over 150 hotspot vouchers, vastly expanding our network reach.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4 md:justify-start">
              <div className="flex flex-col rounded-lg border bg-background/50 px-4 py-2">
                <span className="text-xs text-muted-foreground">Vouchers Sold</span>
                <span className="flex items-center gap-1 font-bold text-lg text-primary">
                  150+ <TrendingUpIcon className="size-4" />
                </span>
              </div>
              <div className="flex flex-col rounded-lg border bg-background/50 px-4 py-2">
                <span className="text-xs text-muted-foreground">New Nodes</span>
                <span className="font-bold text-lg text-primary">12 Active</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
