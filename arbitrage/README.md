# 한국제품 해외판매 마진 분석기 (MVP)

쿠팡·올리브영·이마트 등에서 **싸게 산 한국 제품**을 큐텐·eBay·쇼피 같은
해외 마켓에 팔 때, **건당 실제로 남는 돈**을 계산해 "할만한 제품"을 점수 순으로 정렬한다.

> 이 폴더는 같은 저장소의 인테리어 사이트와 **독립**되어 있다. 추가 의존성 없이 Node 22로 바로 실행된다.

## 실행

```bash
node arbitrage/cli.mjs                         # 샘플 데이터로 실행
node arbitrage/cli.mjs 내제품목록.csv           # 내 CSV로 실행
```

- 콘솔에 점수 순 표를 출력하고
- `arbitrage/report.html` 에 보기 좋은 리포트를 저장한다.

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

## 다음 단계 (남은 자동화)

1. ✅ **원가 자동수집** — 네이버 쇼핑 API (`enrich.mjs`) — 완료
2. **판매가/판매량 자동수집** — 큐텐 QSM API, eBay Browse API
   (실제 팔린 가격 데이터는 eBay가 가장 좋음. 셀러/개발자 계정 필요)
3. **수요·경쟁 자동수집** — 큐텐 베스트셀러/검색 랭킹에서 `monthlySales`·`competitors`
4. **환율 자동 갱신** — 환율 API로 `FX_KRW` 대체
5. 마진 좋은 신상품이 뜨면 알림

커넥터는 모두 표준 컬럼(`name, sourceCostKrw, market, sellPriceLocal, ...`)만 채워주면 되고,
마진 엔진·랭킹은 그대로 재사용한다.

## 주의

- 모든 숫자는 **가정값**이다. 실제 정산은 각 마켓 정산서로 확인할 것.
- 단품·저가·무거운 제품은 국제배송비 때문에 적자가 나기 쉽다(묶음 판매가 유리).
