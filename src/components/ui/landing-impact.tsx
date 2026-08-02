import { cn } from "@/lib/utils";
import Image from "next/image";
import { WifiIcon, GlobeIcon, ZapIcon } from "lucide-react";
import * as motion from "framer-motion/client";

export function LandingImpact() {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-16 md:py-32">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
          viewport={{ once: true, amount: 0.2 }}
          className="order-2 lg:order-1"
        >
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl shadow-2xl">
            <Image
              src="/guinea_market.png"
              alt="Guinea Market Woman using fast wifi"
              fill
              className="object-cover object-center transition-transform duration-1000 hover:scale-105"
            />
            {/* Overlay stats */}
            <div className="absolute bottom-6 left-6 right-6 rounded-xl border border-white/20 bg-black/60 p-6 backdrop-blur-md">
              <div className="flex items-center gap-4 text-white">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/80">
                  <WifiIcon className="size-6" />
                </div>
                <div>
                  <p className="text-xl font-bold">100% Uptime</p>
                  <p className="text-sm text-gray-300">N'Zelekore Main Market</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
          viewport={{ once: true, amount: 0.2 }}
          className="order-1 space-y-8 lg:order-2"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            <GlobeIcon className="size-4" />
            Real Community Impact
          </div>
          
          <h2 className="text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl">
            Empowering the N'Zelekore Market with Connectivity
          </h2>
          
          <p className="text-lg leading-relaxed text-muted-foreground">
            Our high-speed hotspot network is revolutionizing how business is done in the bustling markets of N'Zelekore, Guinea. Market women are now using fast internet connectivity to source goods, communicate with suppliers instantly, and process digital payments.
          </p>

          <div className="space-y-6 pt-4">
            <div className="flex gap-4">
              <div className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <ZapIcon className="size-5" />
              </div>
              <div>
                <h4 className="text-xl font-semibold">Fast, Reliable Access</h4>
                <p className="mt-2 text-muted-foreground">No more dropped connections. Consistent speeds allow for real-time video calls with international wholesalers.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <GlobeIcon className="size-5" />
              </div>
              <div>
                <h4 className="text-xl font-semibold">Digital Financial Inclusion</h4>
                <p className="mt-2 text-muted-foreground">Merchants securely access mobile money platforms and banking apps without leaving their stalls.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
