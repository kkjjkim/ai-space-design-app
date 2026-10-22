// 글 끝 "자주 묻는 질문". 접지 않고 전부 펼쳐 둔다 — 숨긴 글은 검색·AI가 덜 읽는다.
// 같은 내용이 lib/seo.ts faqLd 로 FAQPage 구조화 데이터로도 나간다.
export function InsightFaq({ items }: { items: { q: string; a: string }[] }) {
  if (items.length === 0) return null;
  return (
    <section className="mx-auto mt-14 max-w-2xl" aria-labelledby="insight-faq">
      <h2
        id="insight-faq"
        className="font-display text-[1.65rem] font-semibold leading-snug text-foreground"
      >
        자주 묻는 질문
      </h2>
      <dl className="mt-6 divide-y divide-border">
        {items.map((it) => (
          <div key={it.q} className="py-5">
            <dt className="text-lg font-bold text-foreground">{it.q}</dt>
            <dd className="mt-2 text-[1.0625rem] leading-[1.85] text-foreground/85">
              {it.a}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
