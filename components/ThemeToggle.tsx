"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"

const ThemeToggle = ({onAuth}: ThemeToggleParams) => {
    const { setTheme } = useTheme();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild className={`${onAuth ? 'theme-toggle-auth' : 'theme-toggle'} ${!onAuth && 'md:hover:bg-bank-gradient'}`}>
                    <Button variant={onAuth ? 'outline' : 'ghost'}>
                    <Sun className='theme-toggle-icon rotate-0 scale-100 dark:-rotate-90 dark:scale-0' />
                    <Moon className='theme-toggle-icon absolute rotate-90 scale-0 dark:rotate-0 dark:scale-100' />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" className="bg-white dark:bg-[#121212]">
                <DropdownMenuItem onClick={() => setTheme("light")} className="hover:bg-gray-200 dark:hover:bg-[#191919] cursor-pointer">
                    Light
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setTheme("dark")} className="hover:bg-gray-200 dark:hover:bg-[#191919] cursor-pointer">
                    Dark
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={() => setTheme("system")} className="hover:bg-gray-200 dark:hover:bg-[#191919] cursor-pointer">
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default ThemeToggle