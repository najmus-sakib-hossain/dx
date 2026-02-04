"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export function SiteNav() {
  const pathname = usePathname();

  const projects = [
    { name: "shadcn/ui", href: "/shadcn" },
    { name: "TweakCN", href: "/tweakcn" },
    { name: "Themux", href: "/themux" },
    { name: "Midday", href: "/midday" },
    { name: "React Bits", href: "/react-bits" },
  ];

  return (
    <nav className="flex items-center gap-6">
      <Link href="/" className="text-sm font-medium hover:underline">
        Home
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            Projects
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Explore Projects</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {projects.map((project) => (
            <DropdownMenuItem key={project.href} asChild>
              <Link href={project.href}>{project.name}</Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}
