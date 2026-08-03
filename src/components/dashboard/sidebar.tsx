"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboardIcon, 
  BanknoteIcon, 
  TargetIcon, 
  BotIcon, 
  SettingsIcon,
  CheckSquareIcon,
  FileTextIcon
} from "lucide-react"

import { useLanguage } from "@/components/providers/language-provider"

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
    <div className="flex h-full w-full flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="flex h-[72px] items-center border-b border-sidebar-border px-5">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Image src="/logo.png" alt="QBIX" width={180} height={120} priority className="h-12 w-auto object-contain" />
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-5">
        <p className="mb-3 px-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Workspace</p>
        <nav className="grid items-start space-y-1 px-3 text-sm font-medium">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(`${item.href}/`))
            return (
              <Link
                key={item.translationKey}
                href={item.href}
                onClick={onLinkClick}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-3 transition-colors",
                  isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-[18px] w-[18px]" />
                <span>{t(item.translationKey)}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
