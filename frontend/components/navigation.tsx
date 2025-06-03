"use client"

import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Home, Upload, Search, Users, Terminal } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Navigation() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/upload", label: "Upload", icon: Upload },
    { href: "/search", label: "Search", icon: Search },
    { href: "/candidates", label: "Candidates", icon: Users },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Terminal className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl text-primary font-mono">CV_ANALYZER</span>
            </Link>

            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      className={
                        isActive
                          ? "bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
                          : "text-primary hover:bg-muted hover:text-primary font-mono"
                      }
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.label.toUpperCase()}
                    </Button>
                  </Link>
                )
              })}
            </div>
          </div>

          <ModeToggle />
        </div>
      </div>
    </nav>
  )
}
