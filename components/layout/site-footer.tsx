import Link from "next/link";
import { site, navItems } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="container grid gap-8 py-14 md:grid-cols-2">
        <div>
          <div className="font-serif text-lg font-semibold">{site.brandName}</div>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
            {site.description}
          </p>
        </div>
        <div className="md:text-right">
          <nav className="flex flex-wrap gap-x-6 gap-y-2 md:justify-end">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-foreground/70 hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          {/* 사업자 정보 */}
          <div className="mt-6 space-y-1 text-xs leading-relaxed text-muted-foreground">
            <p>{site.business.name} · 사업자등록번호 {site.business.registration}</p>
            <p>{site.business.address}</p>
            <p>
              <a href={`tel:${site.business.phone}`} className="hover:text-foreground">
                {site.business.phone}
              </a>
            </p>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            © {new Date().getFullYear()} {site.business.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
