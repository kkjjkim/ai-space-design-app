import Link from "next/link";
import { Instagram } from "lucide-react";
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
          {/* 소셜/외부 프로필 링크 (있는 것만) */}
          {(site.social.instagram || site.social.blog) && (
            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 md:justify-end">
              {site.social.instagram && (
                <a
                  href={site.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-foreground/70 hover:text-foreground"
                >
                  <Instagram className="h-4 w-4" />
                  인스타그램
                </a>
              )}
              {site.social.threads && (
                <a
                  href={site.social.threads}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-foreground/70 hover:text-foreground"
                >
                  스레드
                </a>
              )}
              {site.social.blog && (
                <a
                  href={site.social.blog}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-foreground/70 hover:text-foreground"
                >
                  블로그
                </a>
              )}
            </div>
          )}

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
