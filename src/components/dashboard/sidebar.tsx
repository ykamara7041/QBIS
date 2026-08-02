"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  TrendingUpIcon, 
  LayoutDashboardIcon, 
  BanknoteIcon, 
  TargetIcon, 
  BotIcon, 
  SettingsIcon,
  CheckSquareIcon,
  FileTextIcon
} from "lucide-react"

import { useLanguage } from "@/components/providers/language-provider"
import { motion } from "framer-motion"

const navigation = [
  { translationKey: 'nav.overview', href: '/dashboard', icon: LayoutDashboardIcon },
  { translationKey: 'nav.revenue', href: '/dashboard/revenue', icon: BanknoteIcon },
  { translationKey: 'nav.approvals', href: '/dashboard/approvals', icon: CheckSquareIcon },
  { translationKey: 'nav.targets', href: '/dashboard/targets', icon: TargetIcon },
  { translationKey: 'nav.reports', href: '/dashboard/reports', icon: FileTextIcon },
  { translationKey: 'nav.ai_insights', href: '/dashboard/ai', icon: BotIcon },
  { translationKey: 'nav.settings', href: '/dashboard/settings', icon: SettingsIcon },
]

export function Sidebar({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname()
  const { t } = useLanguage()

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card text-card-foreground">
      <div className="flex h-24 items-center border-b px-4 lg:h-[96px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <img src="/logo.png" alt="Qbix Logo" className="h-20 w-auto object-contain" />
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(`${item.href}/`))
            return (
              <Link
                key={item.translationKey}
                href={item.href}
                onClick={onLinkClick}
                className={cn(
                  "relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-lg bg-primary/10"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 350,
                      damping: 30,
                    }}
                  />
                )}
                <item.icon className="relative z-10 h-4 w-4" />
                <span className="relative z-10">{t(item.translationKey)}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
