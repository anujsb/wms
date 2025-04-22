import * as React from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export interface BreadcrumbProps extends React.ComponentProps<"nav"> {
  segments: {
    title: string
    href: string
  }[]
}

export function Breadcrumb({ className, segments, ...props }: BreadcrumbProps) {
  return (
    <nav
      aria-label="breadcrumb"
      className={cn("flex items-center space-x-1 text-sm text-muted-foreground", className)}
      {...props}
    >
      {segments.map((segment, index) => {
        const isLast = index === segments.length - 1

        return (
          <React.Fragment key={segment.href}>
            <Link
              href={segment.href}
              className={cn(
                "hover:text-foreground transition-colors",
                isLast && "text-foreground font-medium pointer-events-none"
              )}
            >
              {segment.title}
            </Link>
            {!isLast && (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </React.Fragment>
        )
      })}
    </nav>
  )
} 