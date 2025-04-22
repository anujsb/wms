import { Breadcrumb } from "@/components/ui/breadcrumb"

interface PageLayoutProps {
  children: React.ReactNode
  breadcrumbs?: {
    title: string
    href: string
  }[]
}

export function PageLayout({ children, breadcrumbs = [] }: PageLayoutProps) {
  return (
    <div className="flex flex-col gap-4 p-6">
      {breadcrumbs.length > 0 && (
        <Breadcrumb segments={breadcrumbs} />
      )}
      {children}
    </div>
  )
} 