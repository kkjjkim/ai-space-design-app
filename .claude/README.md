# 웹 세션 자동 세팅 (Claude Code on the web)

맥북/데스크탑(로컬)에 깐 MCP·스킬은 그 컴퓨터에만 영구 적용된다.
웹(claude.ai/code)은 매번 새 임시 컨테이너라서 로컬 설정이 따라오지 않는다.
그래서 **웹에서도 자동으로 쓰고 싶은 것은 이 repo에 커밋**해 둔다.

## 지금 박혀 있는 것

### 1) 스킬 — `.claude/skills/`
- `frontend-design` : Anthropic 공식 스킬. "AI가 만든 티" 나는 밋밋·획일적 디자인을
  벗어나 의도적인 타이포·팔레트·레이아웃을 잡게 해 준다.
  출처: https://github.com/anthropics/claude-code/tree/main/plugins/frontend-design

### 2) MCP — `.mcp.json`
- `playwright` : 클로드가 자기가 만든 페이지를 브라우저로 직접 보고 고친다. 디자인 퀄리티 핵심.
- `context7`   : 라이브러리 최신 공식 문서를 실시간으로 가져온다. (Next.js, Tailwind 등)

> 웹 세션이 이 repo를 열면 위 스킬은 자동 적용되고, MCP는 프로젝트 MCP로 인식된다.
> (보안상 프로젝트 MCP는 처음 한 번 승인 절차가 있을 수 있다.)

## 안 박는 것 (이유)
- `gh` / `vercel` CLI : 컴퓨터 단위 설치라 repo에 못 박는다. 웹에선 github은 내장 MCP로,
  배포는 Vercel-깃 연동으로 처리한다.
- Supabase MCP : 토큰(시크릿)이 필요해서 `.mcp.json`에 그냥 넣지 않는다.
  쓰려면 환경변수로 키를 넣고 별도 추가한다. (service_role 키는 절대 클라이언트 노출 금지)
