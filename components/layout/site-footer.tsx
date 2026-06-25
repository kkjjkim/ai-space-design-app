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
          {/* 사업자 정보 등은 운영자가 채움 */}
          <p className="mt-6 text-xs text-muted-foreground">
            사업자 정보 · 주소 · 연락처는 운영자가 입력합니다.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            © {new Date().getFullYear()} {site.brandName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
