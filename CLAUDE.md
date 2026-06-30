# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 명령어

```bash
npm run dev      # 개발 서버 실행 (localhost:3000)
npm run build    # 프로덕션 빌드
npm run lint     # ESLint 검사
```

## 아키텍처

### 디렉토리 구조

```
app/                  # Next.js 15 App Router 페이지
  (auth)/             # 인증 관련 라우트 그룹
  protected/          # 인증 필요 페이지 (미들웨어로 보호)
  instruments/        # 악기 목록 페이지
lib/
  supabase/
    client.ts         # 클라이언트 컴포넌트용 Supabase 클라이언트
    server.ts         # 서버 컴포넌트/액션용 Supabase 클라이언트
    proxy.ts          # 미들웨어에서 세션 갱신용 (proxy.ts의 updateSession)
  profile/
    profile.repository.ts   # DB 직접 접근
    profile.service.ts      # 비즈니스 로직, 에러 래핑
components/
  ui/                 # shadcn/ui 컴포넌트
types/
  database.ts         # Supabase 스키마 타입 (수동 관리)
  profile.ts          # 도메인 타입 및 DTO
```

### Supabase 클라이언트 사용 규칙

- **서버 컴포넌트 / Server Action / Route Handler**: `lib/supabase/server.ts`의 `createClient()` 사용
- **클라이언트 컴포넌트**: `lib/supabase/client.ts`의 `createClient()` 사용
- **미들웨어**: `lib/supabase/proxy.ts`의 `updateSession()` 사용
- Fluid compute 환경 고려: 서버 클라이언트를 전역 변수에 저장하지 말 것 (매 요청마다 새로 생성)

### 레이어드 아키텍처 패턴

`lib/` 하위 도메인 폴더는 레이어드 아키텍처를 따릅니다:
- `*.repository.ts`: Supabase 직접 쿼리, 에러 throw
- `*.service.ts`: 레포지토리 호출 후 에러를 `{ data, error }` 형태로 래핑하여 반환

서비스 반환 타입은 `ProfileResult<T>` 패턴 (`types/profile.ts` 참고):
```ts
type ProfileResult<T> = { data: T; error: null } | { data: null; error: string }
```

### 인증 흐름

- `proxy.ts`의 `updateSession`이 `middleware.ts`에서 모든 요청에 대해 세션 쿠키를 갱신
- 미인증 사용자가 `/`, `/login`, `/auth/**` 외 경로 접근 시 `/auth/login`으로 리다이렉트
- `supabase.auth.getClaims()`로 사용자 정보 확인 (`getUser()` 대신 사용)

### 타입 관리

`types/database.ts`는 Supabase 스키마를 반영하는 수동 관리 파일입니다. 스키마 변경 시 이 파일을 직접 업데이트하거나 Supabase MCP의 `generate_typescript_types`를 활용하세요.

## 환경 변수

`.env.local`에 필요한 변수:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```
