# 한국제품 해외판매 마진 분석기 (MVP)

쿠팡·올리브영·이마트 등에서 **싸게 산 한국 제품**을 큐텐·eBay·쇼피 같은
해외 마켓에 팔 때, **건당 실제로 남는 돈**을 계산해 "할만한 제품"을 점수 순으로 정렬한다.

> 이 폴더는 같은 저장소의 인테리어 사이트와 **독립**되어 있다. 추가 의존성 없이 Node 22로 바로 실행된다.

## 전자동 실행 (소싱 리스트 자동 생성)

제품 목록을 넣지 않는다. **발굴 → 원가 → 마진 → 소싱 리스트**를 한 번에 돌린다.

```bash
node arbitrage/auto.mjs --mock                 # 키 없이 전체 흐름 점검
node arbitrage/auto.mjs --source=ebay --query="korean skincare"
# 실제: EBAY_CLIENT_ID/SECRET + NAVER_CLIENT_ID/SECRET 환경변수 필요
```

흐름:
```
발굴(해외 인기 한국제품 + 판매가 + 수요)
  → 원가(네이버 한국 최저가 자동 매칭)
  → 마진 계산 → ⭐ 등급
  → "이거 소싱하세요" 랭킹 리스트 + report.html
```

## 수동 실행 (CSV 직접 분석)

이미 후보 목록이 있으면 계산기만 따로 쓸 수도 있다.

```bash
node arbitrage/cli.mjs                          # 샘플 CSV
node arbitrage/cli.mjs 내제품목록.csv            # 내 CSV
```

## 입력 CSV 형식

```
name,category,source,sourceCostKrw,weightKg,market,sellPriceLocal,promoRate,monthlySales,competitors
```

| 컬럼 | 뜻 |
|---|---|
| `sourceCostKrw` | 한국 구매 원가 — **사입가/도매가/세일가**를 넣어라(소비자가 아님) |
| `weightKg` | 포장 포함 무게(국제배송비 산정용) |
| `market` | `qoo10_jp` / `ebay_us` / `shopee_sg` |
| `sellPriceLocal` | 그 마켓의 현지 통화 판매가 |
| `promoRate` | 메가와리 등 쿠폰 할인 부담분(0~1, 없으면 0) |
| `monthlySales` | 월 판매량 추정(수요 신호, 모르면 0) |
| `competitors` | 같은 상품 파는 셀러 수(경쟁, 모르면 0) |

## 계산 모델 (두뇌)

```
실판매가 = 현지판매가 × (1 − 쿠폰할인) × 환율
순이익 = 실판매가
        − 사입가
        − 마켓 수수료(카테고리별)
        − 국제 배송비(목적지별, 일본행이 가장 쌈)
        − 포장/부대비
        − 반품 충당분
마진율 = 순이익 / 실판매가
ROI   = 순이익 / 사입가
```

## 마진 × 수요 등급 (핵심)

"마진 높고 잘 팔리는 것"을 찾기 위해 2×2로 분류한다.

| 등급 | 조건 | 뜻 |
|---|---|---|
| ⭐ 핵심 | 마진율 ≥ 25% **그리고** 월판매 ≥ 800 | **이게 정답.** 고마진+잘팔림 |
| 💎 고마진 | 마진율 ≥ 25%, 판매 적음 | 마진 좋지만 물량 한계 |
| 🔁 박리다매 | 마진율 15~25%, 잘 팔림 | 물량으로 버는 형 |
| ✅ 무난 | 마진율 15~25%, 판매 적음 | |
| ❌ 회피 | 마진율 < 15% 또는 적자 | 거르기 |

점수 = 마진율(40%) + 순이익(20%) + 수요(30%) − 경쟁(10%) 를 0~100으로 정규화.
⭐ → 💎 → 🔁 순으로 위에 정렬한다.

환율·수수료·배송비·등급 기준선 등 **모든 가정값은 `src/config.mjs` 한 곳**에서 바꾼다
(등급 기준선은 `THRESHOLDS`).

## 사입가 자동수집 (네이버 쇼핑 API)

제품명만 있으면 한국 최저가를 자동으로 `sourceCostKrw`에 채운다.

```bash
# 1) 키 발급: https://developers.naver.com > 애플리케이션 등록 > "검색" API
# 2) 환경변수로 키를 주고 실행 (키는 코드/깃에 넣지 말 것)
NAVER_CLIENT_ID=... NAVER_CLIENT_SECRET=... \
  node arbitrage/enrich.mjs data/sample-products.csv data/enriched.csv

node arbitrage/enrich.mjs --only-missing   # 비어있는 사입가만 채우기
node arbitrage/enrich.mjs --mock           # 키 없이 동작만 점검(가짜 가격)
```

- 중고·미끼성 초저가는 거르고(중앙값 30% 미만 제외) 현실적인 최저가를 고른다.
- 채운 CSV를 그대로 `cli.mjs`에 넣어 분석한다.

> **원격(웹) 환경 주의:** 이 저장소를 Claude Code 웹에서 돌리면 네트워크 egress
> 허용목록에 `openapi.naver.com` 을 추가해야 한다(없으면 403). 본인 PC에서 실행하면 그냥 된다.

## 파일 구조

```
arbitrage/
  cli.mjs              분석 실행 진입점
  enrich.mjs           네이버 사입가 자동수집
  data/sample-products.csv
  src/
    config.mjs         환율·수수료·배송비·등급 기준 (여기만 고치면 됨)
    margin.mjs         손익 계산 엔진
    rank.mjs           점수·등급·정렬
    naver.mjs          네이버 쇼핑 API 커넥터
    loadProducts.mjs   CSV 로더/직렬화
    report.mjs         HTML 리포트
```

## 자동화의 솔직한 제약 (꼭 읽기)

"완전 자동"이라도 **데이터 소스마다 필요한 것**이 다르다. 공짜·무계정으로 다 되진 않는다.

| 데이터 | 소스 | 필요한 것 | 한계 |
|---|---|---|---|
| 한국 원가 | 네이버 쇼핑 API | 무료 개발자 키 | 거의 완벽 |
| 해외 판매가 | **eBay Browse API** | 무료 개발자 키(셀러계정 X) | 현재 시세만, **판매량 없음** |
| 해외 판매가+판매량 | 큐텐 QSM API | **셀러 계정** | 계정 필요 |
| 수요/판매량 | 큐텐 베스트셀러 랭킹 | 스크래핑 | 약관·차단 리스크 |

→ **무계정 최단경로 = eBay Browse(판매가) + 네이버(원가).** 단, 판매량 신호가 빠져
   "마진"은 정확해도 "잘 팔림"은 추정이 약하다.
→ **수요까지 정확히** 하려면 큐텐 셀러 계정(QSM) 또는 베스트셀러 수집이 필요하다.

## 큐텐 크롤링으로 발굴 (계정 불필요)

시장 전체에서 "잘 팔리는 한국제품"을 가져온다. **로컬에서** 실행한다.

```bash
# 1) Playwright 설치 (최초 1회)
pnpm add -D playwright && pnpm exec playwright install chromium

# 2) 디버그로 페이지 구조 확인 → 셀렉터 확정 (최초 1회)
node arbitrage/auto.mjs --source=qoo10 --query="韓国 化粧品" --debug
#    → arbitrage/debug-qoo10.html 가 저장된다. 이걸 보고 src/discover.mjs 의
#      EXTRACT() 셀렉터를 실제 상품카드/가격/리뷰수에 맞게 확정한다.

# 3) 정상 실행
node arbitrage/auto.mjs --source=qoo10 --query="韓国 化粧品"
```

> ⚠️ 이 원격(웹) 환경에서는 큐텐 접속이 막혀(egress) 크롤링이 안 된다. **본인 PC에서** 돌리거나
>    `www.qoo10.jp` 를 네트워크 허용목록에 추가해야 한다.
> ⚠️ 크롤링은 사이트 약관·차단 리스크가 있다. 호출 빈도를 낮추고(단일 페이지·지연 포함) 과도하게 긁지 말 것.

## QSM(셀러 계정)은 "발굴"이 아니라 "운영"용

QSM API 는 **내 가게** 운영(상품 등록·주문·정산·내 판매통계)을 위한 것이다.
경쟁사가 뭘 잘 파는지(발굴·수요)는 주지 않는다. 그래서 순서는:

1. **발굴** = 크롤링(큐텐 베스트셀러) + 네이버(원가) → 소싱 리스트  ← 지금 단계
2. **운영** = 고른 제품을 QSM(내 계정)으로 자동 등록·주문관리  ← 나중 단계

## 발굴 소스 추가하는 법

`src/discover.mjs` 의 `discoverProducts({ source })` 에 케이스를 하나 더 붙이면 된다.
후보를 표준 형식 `{ name, category, market, sellPriceLocal, monthlySales?, competitors? }`
으로만 돌려주면 원가 매칭·마진·랭킹은 그대로 재사용된다.

## 남은 자동화

1. ✅ 원가 자동수집 — 네이버 (`src/naver.mjs`)
2. ✅ 발굴 + 전자동 오케스트레이션 — `auto.mjs` (mock · eBay · 큐텐 크롤)
3. 🔧 큐텐 크롤 셀렉터 확정 — `--debug` 로 실제 페이지 보고 EXTRACT() 마무리(+리뷰수=수요)
4. QSM 연동(운영) — 고른 제품 자동 등록·주문관리 (셀러 계정)
5. 환율 자동 갱신 — `FX_KRW` 를 환율 API로
6. 정기 실행 + 마진 좋은 신상품 알림

## 주의

- 모든 숫자는 **가정값**이다. 실제 정산은 각 마켓 정산서로 확인할 것.
- 단품·저가·무거운 제품은 국제배송비 때문에 적자가 나기 쉽다(묶음 판매가 유리).
