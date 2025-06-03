"use client"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="border-border hover:bg-muted">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-primary" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-primary" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-card border-border">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="text-primary hover:bg-muted hover:text-primary font-mono"
        >
          <Sun className="h-4 w-4 mr-2" />
          LIGHT
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="text-primary hover:bg-muted hover:text-primary font-mono"
        >
          <Moon className="h-4 w-4 mr-2" />
          DARK
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="text-primary hover:bg-muted hover:text-primary font-mono"
        >
          <Monitor className="h-4 w-4 mr-2" />
          SYSTEM
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
