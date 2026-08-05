"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, ChevronDown, Menu, LogOut, Search, Settings, User as UserIcon, Globe, DollarSign } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Sidebar } from "./sidebar"
import { logoutUser } from "@/actions/auth"
import { ThemeToggle } from "@/components/theme-toggle"
import { useState } from "react"
import { useLanguage } from "@/components/providers/language-provider"

interface TopbarProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export function Topbar({ user }: TopbarProps) {
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const handleLogout = async () => {
    await logoutUser()
    window.location.href = "/login"
  }

  const navigateTo = (url: string) => {
    setProfileOpen(false)
    window.location.href = url
  }

  const getInitials = (name?: string | null) => {
    if (!name) return "U"
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()
  }

  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center gap-4 border-b bg-card/95 px-4 backdrop-blur md:px-6">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <button className="inline-flex items-center justify-center rounded-md border border-input bg-background p-2 hover:bg-accent hover:text-accent-foreground md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 flex flex-col w-64">
          <Sidebar onLinkClick={() => setIsOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="w-full flex-1">
        <div className="relative hidden max-w-sm md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input className="h-10 w-full rounded-xl border bg-muted/40 pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10" placeholder="Search transactions, reports..." aria-label="Search" />
        </div>
      </div>
      <button className="relative rounded-xl p-2.5 text-muted-foreground transition hover:bg-muted" aria-label="Notifications">
        <Bell className="h-[18px] w-[18px]" />
        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary ring-2 ring-card" />
      </button>
      <ThemeToggle />

      <DropdownMenu open={profileOpen} onOpenChange={setProfileOpen}>
        <DropdownMenuTrigger asChild>
          <button className="inline-flex items-center gap-2 rounded-xl p-1.5 pr-2 transition hover:bg-muted cursor-pointer">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.image || ""} alt={user.name || "User"} />
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <span className="hidden max-w-28 truncate text-sm font-semibold lg:block">{user.name || "User"}</span>
            <ChevronDown className="hidden h-4 w-4 text-muted-foreground lg:block" />
            <span className="sr-only">Toggle user menu</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigateTo("/dashboard/profile")} className="cursor-pointer font-medium">
            <UserIcon className="mr-2 h-4 w-4 text-blue-600" />
            <span>{t('topbar.my_account') || "My Account / Profile"}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigateTo("/dashboard/settings")} className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>{t('nav.settings')}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigateTo("/dashboard/settings?tab=preferences")} className="cursor-pointer">
            <Globe className="mr-2 h-4 w-4" />
            <span>Language</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigateTo("/dashboard/settings?tab=preferences")} className="cursor-pointer">
            <DollarSign className="mr-2 h-4 w-4" />
            <span>Currency</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive focus:text-destructive-foreground cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            <span>{t('topbar.logout')}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
