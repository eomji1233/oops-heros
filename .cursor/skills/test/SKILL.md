---
name: test
description: >-
  Fix-and-verify loop: the agent must personally run real checks (browser,
  network, console, scripts, or automated tests) and keep iterating until the
  reported issue is actually resolved. Use when the user invokes /test, says
  될때까지 테스트, 직접 테스트, 직접 확인, 테스트해서 확인해, or insists the
  agent verify with console/network/browser instead of claiming success from
  code reading alone.
---

# Goal

코드를 읽고 "됐을 것"이라고 끝내지 않는다. **직접 실행·관측해서 통과할 때까지** 수정하고, 그다음에만 결과를 보고한다.

# When to use

- 사용자가 `/test` 를 호출한 경우
- "될때까지 테스트", "직접 테스트", "직접 확인", "콘솔 확인해", "네트워크 확인해" 등 **검증을 강제**하는 요청
- 버그/요청 중복/로딩 이슈처럼 **런타임 재현**이 필요한 경우

# Hard rules (MUST)

1. **추측으로 완료 선언 금지** — 코드 리뷰·정적 분석만으로 "고쳤다/된다"고 말하지 않는다.
2. **직접 검증 필수** — 아래 수단 중 가능한 것을 **실제로 실행**한다.
   - Playwright/브라우저로 페이지 진입 후 Network·콘솔 관측
   - 개발 서버 + API/스크립트로 요청 횟수·응답 확인
   - 단위/통합 테스트 (`pnpm test` 등) 실행
   - 필요 시 임시 로그를 넣고 실행 후 제거
3. **실패하면 계속** — 검증 실패 시 원인을 고치고 **같은 검증을 다시** 돌린다. 통과할 때까지 반복.
4. **사용자에게 "확인해 보세요"로 떠넘기지 않는다** — 본인이 통과를 확인한 뒤에만 보고한다.
5. **보고에는 증거** — 무엇을 어떻게 돌려서 뭐가 나왔는지(요청 N회, 콘솔 에러 없음, 테스트 PASS 등)를 짧게 적는다.

# Workflow

```
Progress:
- [ ] 1. 재현 조건 정의 (무엇을 통과로 볼지)
- [ ] 2. 검증 수단 선택·실행 (브라우저/네트워크/콘솔/스크립트/테스트)
- [ ] 3. 실패 시 수정
- [ ] 4. 동일 검증 재실행
- [ ] 5. 통과 확인 후에만 사용자에게 결과 보고
```

## 1. Define pass criteria

한 줄로 통과 조건을 고정한다. 예:

- `stats` / `team-stats` / `search` 가 페이지 로드당 **각 1회**
- 로딩 스피너가 요청 완료 후 사라짐
- 콘솔에 관련 에러 없음

## 2. Prefer real runtime checks

이 레포(Vue + Vite)에서 우선순위:

1. **Playwright(또는 동등한 브라우저 자동화)** 로 해당 라우트 진입 → Network에서 API 호출 수/상태 확인
2. 인증이 필요하면 라우트 목킹 또는 기존 세션/쿠키로 재현
3. 브라우저가 어려우면 **재현 스크립트**로 axios/API 호출 횟수를 센다
4. 로직이 있으면 콘솔/터미널 출력을 읽어 근거로 남긴다

HMR만 믿고 끝내지 말 것. 가능하면 **하드 내비게이션/클린 로드** 기준으로 본다.

## 3. Loop until green

```
while (검증 실패) {
  원인 수정
  같은 통과 조건으로 재검증
}
```

중간에 "아마 됐을 것"으로 break 하지 않는다.

## 4. Report format

```markdown
### 검증 결과
- 통과 조건: …
- 실행한 검증: … (도구/명령/페이지)
- 관측: … (예: stats 1, team-stats 1, search 1 / 콘솔 에러 없음)
- 결론: PASS
```

실패 중이라면 PASS라고 쓰지 말고, 아직 루프 중임을 밝히고 계속 고친다.

# Anti-patterns

- ❌ 코드만 보고 "이제 한 번만 나갈 거예요"
- ❌ "새로고침 해서 확인해 보세요"로 검증을 사용자에게 위임
- ❌ 한 번 실패했는데 설명만 바꾸고 재실행 안 함
- ❌ HMR 잔상/이전 인스턴스 요청을 무시하고 성공으로 간주
