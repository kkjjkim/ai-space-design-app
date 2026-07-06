"use client";

import Script from "next/script";
import { useEffect } from "react";
import { captureSource } from "@/lib/attribution";
import { site } from "@/lib/site";

// 분석/광고 스크립트 로더 + 유입 출처 캡처.
// ID가 비어 있으면 아무 스크립트도 로드하지 않는다(성능·프라이버시).
export function Analytics() {
  // 모든 페이지 첫 렌더에서 유입 출처를 잡아둔다(첫 터치 기준).
  useEffect(() => {
    captureSource();
  }, []);

  const { ga4, googleAdsId, metaPixelId } = site.analytics;
  const gtagId = ga4 || googleAdsId; // 하나의 gtag 로더로 둘 다 config

  return (
    <>
      {gtagId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gtagId}`}
            strategy="afterInteractive"
          />
          <Script id="gtag-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              ${ga4 ? `gtag('config', '${ga4}');` : ""}
              ${googleAdsId ? `gtag('config', '${googleAdsId}');` : ""}
            `}
          </Script>
        </>
      )}

      {metaPixelId && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${metaPixelId}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}
    </>
  );
}
