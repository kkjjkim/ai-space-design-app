"use client";

import { useEffect } from "react";
import { site } from "@/lib/site";

// 신청 완료(/complete) 도달 시 전환 이벤트 발사.
// GA4 리드 이벤트 + Google Ads 전환 + Meta 리드. (ID가 있을 때만 실제 전송됨)
export function ConversionTracker() {
  useEffect(() => {
    const w = window as unknown as {
      gtag?: (...args: unknown[]) => void;
      fbq?: (...args: unknown[]) => void;
    };
    const { googleAdsId, googleAdsLabel } = site.analytics;

    // GA4 — 리드 전환 이벤트
    w.gtag?.("event", "generate_lead", { currency: "KRW", value: 0 });

    // Google Ads — 전환 (ID + 라벨 있을 때)
    if (googleAdsId && googleAdsLabel) {
      w.gtag?.("event", "conversion", {
        send_to: `${googleAdsId}/${googleAdsLabel}`,
      });
    }

    // Meta(페북·인스타) — 리드
    w.fbq?.("track", "Lead");
  }, []);

  return null;
}
