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
name,category,source,sourceCostKrw,weightKg,market,sellPriceLocal,monthlySales
```

| 컬럼 | 뜻 |
|---|---|
| `sourceCostKrw` | 한국 구매 원가(소비자가, VAT 포함) |
| `weightKg` | 포장 포함 무게(국제배송비 산정용) |
| `market` | `qoo10_jp` / `ebay_us` / `shopee_sg` |
| `sellPriceLocal` | 그 마켓의 현지 통화 판매가 |
| `monthlySales` | 월 판매량(수요 신호, 모르면 0) |

## 계산 모델 (두뇌)

```
판매가(원) = 현지판매가 × 환율
순이익 = 판매가(원)
        − 원가
        − 마켓 수수료
        − 결제 수수료
        − 국제 배송비
        − 포장/부대비
        − 반품 충당분
마진율 = 순이익 / 판매가(원)
ROI   = 순이익 / 원가
```

점수 = 마진율(45%) + 건당 순이익(35%) + 수요(20%) 를 0~100으로 정규화.
마진율 15% 미만이거나 적자면 추천에서 제외(✅ 표시 없음).

환율·수수료·배송비 등 **모든 가정값은 `src/config.mjs` 한 곳**에서 바꾼다.

## 파일 구조

```
arbitrage/
  cli.mjs              실행 진입점
  data/sample-products.csv
  src/
    config.mjs         환율·수수료·배송비·점수 가중치 (여기만 고치면 됨)
    margin.mjs         손익 계산 엔진
    rank.mjs           점수·정렬
    loadProducts.mjs   CSV 로더
    report.mjs         HTML 리포트
```

## 다음 단계 (데이터 자동수집)

지금은 CSV 수동 입력이다. 자동화는 데이터 커넥터를 하나씩 붙이면 된다.

1. **원가 자동수집** — 네이버 쇼핑 검색 API로 한국 최저가 조회
   (쿠팡·올리브영은 공개 API가 없어 스크래핑이 필요하고 약관·차단 이슈가 있다)
2. **판매가/판매량 자동수집** — eBay Browse API, 큐텐 QSM API
   (실제 팔린 가격 데이터는 eBay가 가장 좋음. 셀러/개발자 계정 필요)
3. **환율 자동 갱신** — 환율 API로 `FX_KRW` 대체
4. 마진 좋은 신상품이 뜨면 알림

커넥터는 모두 `{ name, sourceCostKrw, market, sellPriceLocal, ... }` 형태로
제품 객체만 만들어 주면 되고, 마진 엔진·랭킹은 그대로 재사용한다.

## 주의

- 모든 숫자는 **가정값**이다. 실제 정산은 각 마켓 정산서로 확인할 것.
- 단품·저가·무거운 제품은 국제배송비 때문에 적자가 나기 쉽다(묶음 판매가 유리).
