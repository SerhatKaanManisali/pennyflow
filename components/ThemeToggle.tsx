"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"

const ThemeToggle = () => {
    const { setTheme } = useTheme();
    
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild className="theme-toggle">
                <Button variant="ghost">
                    <Sun className="theme-toggle-icon rotate-0 scale-100 dark:-rotate-90 dark:scale-0" />
                    <Moon className="theme-toggle-icon absolute rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="bg-white dark:bg-[#121212]">
                <DropdownMenuItem onClick={() => setTheme("light")} className="hover:bg-gray-300 dark:hover:bg-[#191919] cursor-pointer">
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")} className="hover:bg-gray-300 dark:hover:bg-[#191919] cursor-pointer">
                    Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")} className="hover:bg-gray-300 dark:hover:bg-[#191919] cursor-pointer">
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default ThemeToggle