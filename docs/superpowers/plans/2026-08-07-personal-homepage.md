# 개인 홈페이지 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Astro 기반 한국어 포트폴리오·블로그 정적 사이트를 만들어 https://hadokim.github.io 에 자동 배포한다.

**Architecture:** 마크다운 파일이 콘텐츠의 유일한 원본이다. Astro 콘텐츠 컬렉션이 frontmatter를 스키마로 검증하고, 페이지가 콘텐츠를 조회·정렬해 표시 전용 컴포넌트에 넘긴다. 순수 함수(slug 도출·정렬·필터·문구 조회)는 `src/lib`과 `src/i18n`에 모아 vitest로 검증하고, 페이지 렌더링은 빌드 산출물 HTML을 직접 확인해 검증한다. `main` push → GitHub Actions 빌드 → Pages 배포.

**Tech Stack:** Astro 7.x, TypeScript, vitest, @astrojs/rss, @astrojs/sitemap, Pretendard(동적 서브셋), GitHub Actions

## Global Constraints

- **Node ≥ 22.12.0** — Astro 7의 engines 요구사항. 개발 환경 확인값: Node v24.14.1, npm 11.11.0, git 2.53.0.
- **저장소 이름은 `HaDoKim.github.io`** — 사용자 사이트로 만들어 `base` 설정을 불필요하게 한다.
- **`site: 'https://hadokim.github.io'`**, **`base`는 설정하지 않는다.**
- **기본 언어 `ko`, `prefixDefaultLocale: false`** — 한국어 URL에 접두사가 붙지 않는다.
- **화면에 보이는 모든 문구는 `src/i18n/ui.ts`를 거친다.** 컴포넌트·페이지에 한글 문자열을 직접 쓰지 않는다. (사용자가 입력한 콘텐츠 본문은 예외)
- **콘텐츠 파일 경로는 `src/content/{blog,projects}/ko/`** — 언어 폴더를 반드시 거친다.
- **slug에는 소문자 영문·숫자·하이픈만 쓴다.**
- **커밋 메시지는 Conventional Commits** (`feat:`, `chore:`, `fix:`, `docs:`).
- **모든 커밋 전 `npm run build`가 통과해야 한다.**

## 스펙 대비 변경 사항

계획 작성 중 확인한 사실과 그에 따른 판단이다. 스펙(`docs/superpowers/specs/2026-08-07-personal-homepage-design.md`)에도 반영했다.

| 항목 | 스펙 최초 기재 | 실제 / 계획 | 이유 |
|---|---|---|---|
| Astro 버전 | 5.x | **7.x (7.2.0)** | 현재 최신. 5.x는 이미 두 메이저 뒤 |
| Node 요구 | 20 LTS 이상 | **22.12 이상** | Astro 7 engines 요구값 |
| 컬렉션 설정 위치 | `src/content/config.ts` | **`src/content.config.ts`** | 현행 API 위치 |
| 유닛 테스트 | "과하다, 빌드로 갈음" | **순수 함수만 vitest** | 아래 설명 |
| draft 처리 | "빌드에서 제외" | **프로덕션만 제외, dev에선 보임** | 아래 설명 |

**유닛 테스트를 일부 도입한 이유.** 스펙 7절은 유닛 테스트를 두지 않기로 했다. 그 판단은 페이지 렌더링에 대해서는 그대로 따른다 — 빌드 산출물을 확인하는 쪽이 싸고 정확하다. 다만 slug 도출, 날짜 정렬, draft 필터, 문구 조회 이 넷은 조건 분기가 있는 순수 함수라 눈으로는 틀린 걸 못 잡는다. 특히 slug 도출은 **모든 페이지 주소를 결정하는 함수**여서 여기가 틀리면 사이트 전체가 조용히 잘못된 주소로 빌드된다. 테스트 파일 2개, 20줄 남짓이다. 부담이라 판단되시면 Task 2·3의 테스트 단계만 빼면 되고 나머지 구조는 그대로 성립한다.

**draft를 dev에서 보이게 한 이유.** 스펙 문구대로 항상 숨기면 쓰는 중인 글을 로컬에서 미리볼 방법이 없어진다. 공개 사이트에 안 나가면 되는 것이므로 프로덕션 빌드에서만 제외한다. 스펙의 의도("쓰다 만 글이 공개되지 않는다")는 그대로 지켜진다.

---

## 파일 구조

| 파일 | 책임 |
|---|---|
| `astro.config.mjs` | site·i18n·통합(sitemap) 설정 |
| `src/content.config.ts` | 두 컬렉션의 frontmatter 스키마 정의 |
| `src/i18n/ui.ts` | 화면 문구 사전. 영어 확장 지점 |
| `src/i18n/utils.ts` | 문구 조회 함수 `useTranslations` |
| `src/lib/content.ts` | id→slug/locale 도출, 정렬, draft 필터, 상위 N개 추출 |
| `src/layouts/BaseLayout.astro` | `<html>`·`<head>` 메타·헤더·푸터. 콘텐츠를 모른다 |
| `src/layouts/PostLayout.astro` | 글 상세 뼈대 (제목·날짜·태그·본문·이전/다음) |
| `src/layouts/ProjectLayout.astro` | 프로젝트 상세 뼈대 (제목·스택·링크·본문) |
| `src/components/*.astro` | 넘겨받은 데이터를 그리기만 한다. 파일시스템 접근 없음 |
| `src/pages/**` | 콘텐츠 조회·정렬·필터 후 컴포넌트에 전달. 폴더 구조가 곧 URL |
| `src/styles/global.css` | 색 토큰·타이포·다크모드·본문 스타일 |
| `.github/workflows/deploy.yml` | 빌드·배포 파이프라인 |

---

## Task 1: 프로젝트 초기화와 배포 파이프라인

가장 위험한 미지수는 "내 저장소에서 실제로 배포가 되는가"다. 내용이 하나도 없는 상태에서 이것부터 끝낸다.

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`
- Create: `src/pages/index.astro`
- Create: `.github/workflows/deploy.yml`
- Create: `public/favicon.svg`

**Interfaces:**
- Consumes: 없음 (최초 태스크)
- Produces: `npm run dev` / `npm run build` / `npm run test` 스크립트, `site: 'https://hadokim.github.io'` 설정, 배포 워크플로

- [ ] **Step 1: Astro 프로젝트 생성**

`D:\996.Vibe\HomePage` 에서 실행한다. 대화형 프롬프트가 뜨면 템플릿은 **Empty**, TypeScript는 **Strict**, 의존성 설치는 **Yes**, git 초기화는 **No**(다음 단계에서 직접 한다)를 고른다.

```bash
npm create astro@latest . -- --template minimal --install --no-git --typescript strict
```

- [ ] **Step 2: 버전 확인**

Run: `npx astro --version`
Expected: `7.` 로 시작하는 버전 (예: `astro  7.2.0`)

7.x가 아니면 중단하고 보고한다. 이 계획의 API는 7.x 기준이다.

- [ ] **Step 3: 추가 의존성 설치**

```bash
npm install @astrojs/rss @astrojs/sitemap
npm install -D @astrojs/check typescript vitest
```

- [ ] **Step 4: `astro.config.mjs` 작성**

```javascript
// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://hadokim.github.io',
  integrations: [sitemap()],
  i18n: {
    locales: ['ko'],
    defaultLocale: 'ko',
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
```

`base`는 설정하지 않는다. 저장소 이름이 `HaDoKim.github.io`라 사이트가 도메인 루트에 놓인다.

- [ ] **Step 5: `package.json`의 scripts 교체**

```json
  "scripts": {
    "dev": "astro dev",
    "build": "astro check && astro build",
    "preview": "astro preview",
    "test": "vitest run"
  },
```

`build`가 `astro check`를 먼저 돌리므로, 타입 오류가 있으면 빌드가 실패하고 배포가 중단된다.

- [ ] **Step 6: `vitest.config.ts` 생성**

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
  },
});
```

- [ ] **Step 7: `public/favicon.svg` 생성**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="#1f2937"/>
  <text x="16" y="22" font-family="sans-serif" font-size="18" font-weight="700"
        fill="#ffffff" text-anchor="middle">I</text>
</svg>
```

- [ ] **Step 8: 임시 홈 페이지 작성**

`src/pages/index.astro` 를 통째로 아래로 교체한다. 이 내용은 Task 8에서 진짜 홈으로 대체된다.

```astro
---
---
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" href="/favicon.svg" />
    <title>배포 확인</title>
  </head>
  <body>
    <h1>DEPLOY_OK</h1>
  </body>
</html>
```

- [ ] **Step 9: `.gitignore` 확인·보강**

```
node_modules/
dist/
.astro/
.DS_Store
*.log
.env
.env.production
```

- [ ] **Step 10: 빌드가 통과하는지 확인**

Run: `npm run build`
Expected: 오류 없이 종료. `dist/index.html` 생성.

Run: `node -e "const s=require('fs').readFileSync('dist/index.html','utf8'); if(!s.includes('DEPLOY_OK')) throw new Error('DEPLOY_OK not found'); console.log('OK')"`
Expected: `OK`

- [ ] **Step 11: 배포 워크플로 작성**

`.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v7
      - name: Build site
        uses: withastro/action@v6

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v5
```

- [ ] **Step 12: git 저장소 초기화와 첫 커밋**

```bash
git init -b main
git add -A
git commit -m "chore: scaffold Astro site with GitHub Pages deploy workflow"
```

- [x] **Step 13: 사용자 작업 — GitHub 저장소 생성** — 2026-08-07 완료

사용자가 이미 생성했고 확인까지 마쳤다. 재실행 불필요.

```
HaDoKim/HaDoKim.github.io — PUBLIC, isEmpty: true, 초기 파일 없음
```

- [ ] **Step 14: 원격 연결과 push**

```bash
git remote add origin https://github.com/HaDoKim/HaDoKim.github.io.git
git push -u origin main
```

- [x] **Step 15: Pages 소스 설정** — 2026-08-07 완료

`gh api -X POST .../pages -f build_type=workflow` 로 이미 설정하고 재조회로 확인했다. 재실행 불필요.

```
build_type: workflow, html_url: https://hadokim.github.io/, https_enforced: true
```

- [ ] **Step 16: 배포 확인**

저장소 **Actions** 탭에서 워크플로가 초록색으로 끝나는지 확인한다 (2~3분).

Run: `curl -s https://hadokim.github.io | grep -c DEPLOY_OK`
Expected: `1`

Pages 최초 활성화는 몇 분 더 걸릴 수 있다. 404가 나오면 3분 뒤 한 번 더 시도한다. 그래도 안 되면 Step 15의 Source 설정을 다시 확인한다.

---

## Task 2: 화면 문구 모듈

**Files:**
- Create: `src/i18n/ui.ts`
- Create: `src/i18n/utils.ts`
- Test: `src/i18n/utils.test.ts`

**Interfaces:**
- Consumes: 없음
- Produces:
  - `defaultLang: 'ko'`
  - `languages: Record<string, string>` — 활성 언어 목록
  - `type Lang = keyof typeof ui`
  - `type UIKey = keyof (typeof ui)['ko']`
  - `useTranslations(lang: Lang): (key: UIKey) => string`

- [ ] **Step 1: 실패하는 테스트 작성**

`src/i18n/utils.test.ts`:

```typescript
import { describe, expect, it } from 'vitest';
import { useTranslations } from './utils';
import { defaultLang, languages } from './ui';

describe('useTranslations', () => {
  it('기본 언어의 문구를 반환한다', () => {
    const t = useTranslations('ko');
    expect(t('nav.blog')).toBe('블로그');
  });

  it('모든 키가 빈 문자열이 아니다', () => {
    const t = useTranslations('ko');
    const keys = ['nav.about', 'nav.projects', 'nav.blog'] as const;
    for (const key of keys) {
      expect(t(key).length).toBeGreaterThan(0);
    }
  });
});

describe('languages', () => {
  it('현재는 한국어 하나만 활성화되어 있다', () => {
    expect(Object.keys(languages)).toEqual(['ko']);
  });

  it('기본 언어가 활성 언어 목록에 들어 있다', () => {
    expect(Object.keys(languages)).toContain(defaultLang);
  });
});
```

- [ ] **Step 2: 테스트가 실패하는지 확인**

Run: `npm run test`
Expected: FAIL — `Failed to resolve import "./utils"`

- [ ] **Step 3: `src/i18n/ui.ts` 작성**

```typescript
export const defaultLang = 'ko' as const;

/** 활성 언어. 여기에 en을 추가하면 언어 전환 버튼이 자동으로 나타난다. */
export const languages = {
  ko: '한국어',
} as const;

export const ui = {
  ko: {
    'site.title': 'IanKim',
    'site.description': '만든 것과 배운 것을 기록하는 공간',

    'nav.home': '홈',
    'nav.about': '소개',
    'nav.projects': '프로젝트',
    'nav.blog': '블로그',

    'home.featured': '주요 프로젝트',
    'home.recent': '최근 글',
    'home.more.projects': '프로젝트 전체 보기',
    'home.more.blog': '글 전체 보기',

    'post.date': '작성일',
    'post.tags': '태그',
    'post.prev': '이전 글',
    'post.next': '다음 글',
    'post.draft': '초안',

    'project.stack': '사용 기술',
    'project.repo': '저장소',
    'project.demo': '데모',

    'blog.empty': '아직 올린 글이 없습니다.',
    'projects.empty': '아직 올린 프로젝트가 없습니다.',
    'tags.title': '태그',
    'tags.heading': '태그별 글',

    'theme.toggle': '다크 모드 전환',

    'notfound.title': '페이지를 찾을 수 없습니다',
    'notfound.body': '주소가 바뀌었거나 삭제된 페이지입니다.',
    'notfound.home': '홈으로',
    'notfound.blog': '글 목록으로',

    'footer.rss': 'RSS',
  },
  // en: { ... }  ← 영어 확장 지점. 위 키를 그대로 복사해 값만 번역한다.
} as const;

export type Lang = keyof typeof ui;
export type UIKey = keyof (typeof ui)[typeof defaultLang];
```

- [ ] **Step 4: `src/i18n/utils.ts` 작성**

```typescript
import { defaultLang, ui, type Lang, type UIKey } from './ui';

/**
 * 해당 언어의 문구 조회 함수를 돌려준다.
 * 번역이 빠진 키는 기본 언어 값으로 대체하므로 화면에 빈칸이 나오지 않는다.
 */
export function useTranslations(lang: Lang) {
  return function t(key: UIKey): string {
    const table = ui[lang] as Record<string, string>;
    const fallback = ui[defaultLang] as Record<string, string>;
    return table[key] ?? fallback[key];
  };
}
```

- [ ] **Step 5: 테스트가 통과하는지 확인**

Run: `npm run test`
Expected: PASS — 4 tests passed

- [ ] **Step 6: 커밋**

```bash
git add src/i18n vitest.config.ts
git commit -m "feat: add i18n string table and translation helper"
```

---

## Task 3: 콘텐츠 컬렉션과 조회 헬퍼

**Files:**
- Create: `src/content.config.ts`
- Create: `src/lib/content.ts`
- Test: `src/lib/content.test.ts`
- Create: `src/content/blog/ko/2026-08-07-hello.md`
- Create: `src/content/projects/ko/sample-project.md`
- Create: `public/images/blog/.gitkeep`, `public/images/projects/.gitkeep`

**Interfaces:**
- Consumes: 없음
- Produces:
  - 컬렉션 `blog`, `projects`
  - `localeOf(id: string): string`
  - `slugOf(id: string): string`
  - `filterVisible<T extends { data: { draft: boolean } }>(entries: T[], includeDrafts: boolean): T[]`
  - `byDateDesc(a: { data: { date: Date } }, b: { data: { date: Date } }): number`
  - `topN<T>(entries: T[], n: number): T[]`
  - `formatDate(date: Date): string`

- [ ] **Step 1: 실패하는 테스트 작성**

`src/lib/content.test.ts`:

```typescript
import { describe, expect, it } from 'vitest';
import {
  byDateDesc,
  filterVisible,
  formatDate,
  localeOf,
  slugOf,
  topN,
} from './content';

describe('localeOf', () => {
  it('id의 첫 구간을 언어로 읽는다', () => {
    expect(localeOf('ko/2026-08-07-hello')).toBe('ko');
    expect(localeOf('en/2026-08-07-hello')).toBe('en');
  });
});

describe('slugOf', () => {
  it('언어 폴더와 날짜 접두사를 제거한다', () => {
    expect(slugOf('ko/2026-08-07-hello')).toBe('hello');
  });

  it('날짜 접두사가 없으면 언어 폴더만 제거한다', () => {
    expect(slugOf('ko/sample-project')).toBe('sample-project');
  });

  it('slug 안의 하이픈과 숫자를 보존한다', () => {
    expect(slugOf('ko/2026-08-07-astro-7-upgrade')).toBe('astro-7-upgrade');
  });

  it('날짜처럼 보이는 문자열이 slug 중간에 있어도 건드리지 않는다', () => {
    expect(slugOf('ko/2026-08-07-retro-2025-01-01')).toBe('retro-2025-01-01');
  });
});

describe('filterVisible', () => {
  const entries = [
    { data: { draft: false } },
    { data: { draft: true } },
  ];

  it('초안을 제외한다', () => {
    expect(filterVisible(entries, false)).toHaveLength(1);
  });

  it('초안 포함 모드에서는 전부 남긴다', () => {
    expect(filterVisible(entries, true)).toHaveLength(2);
  });
});

describe('byDateDesc', () => {
  it('최신 날짜가 앞으로 온다', () => {
    const entries = [
      { data: { date: new Date('2026-01-01') } },
      { data: { date: new Date('2026-08-07') } },
    ];
    const sorted = [...entries].sort(byDateDesc);
    expect(sorted[0].data.date.getFullYear()).toBe(2026);
    expect(sorted[0].data.date.getMonth()).toBe(7);
  });
});

describe('topN', () => {
  it('앞에서 n개만 남긴다', () => {
    expect(topN([1, 2, 3, 4, 5], 3)).toEqual([1, 2, 3]);
  });

  it('개수가 모자라면 있는 만큼만 돌려준다', () => {
    expect(topN([1, 2], 3)).toEqual([1, 2]);
  });
});

describe('formatDate', () => {
  it('YYYY.MM.DD 형식으로 만든다', () => {
    expect(formatDate(new Date('2026-08-07T00:00:00Z'))).toBe('2026.08.07');
  });
});
```

- [ ] **Step 2: 테스트가 실패하는지 확인**

Run: `npm run test`
Expected: FAIL — `Failed to resolve import "./content"`

- [ ] **Step 3: `src/lib/content.ts` 작성**

```typescript
/**
 * 콘텐츠 엔트리의 id는 컬렉션 base 기준 상대 경로에서 확장자를 뺀 값이다.
 * 예: src/content/blog/ko/2026-08-07-hello.md → "ko/2026-08-07-hello"
 */

const DATE_PREFIX = /^\d{4}-\d{2}-\d{2}-/;

/** id의 첫 구간(언어 폴더)을 돌려준다. */
export function localeOf(id: string): string {
  return id.split('/')[0];
}

/** URL에 쓰는 slug. 언어 폴더와 맨 앞 날짜 접두사를 제거한다. */
export function slugOf(id: string): string {
  const withoutLocale = id.split('/').slice(1).join('/');
  return withoutLocale.replace(DATE_PREFIX, '');
}

/** 초안 제외 필터. includeDrafts가 true면 그대로 통과시킨다. */
export function filterVisible<T extends { data: { draft: boolean } }>(
  entries: T[],
  includeDrafts: boolean,
): T[] {
  return includeDrafts ? entries : entries.filter((e) => !e.data.draft);
}

/** 최신순 정렬 비교 함수. */
export function byDateDesc(
  a: { data: { date: Date } },
  b: { data: { date: Date } },
): number {
  return b.data.date.getTime() - a.data.date.getTime();
}

/** 앞에서 n개만 취한다. */
export function topN<T>(entries: T[], n: number): T[] {
  return entries.slice(0, n);
}

/** 화면 표시용 날짜. 시간대에 흔들리지 않도록 UTC 기준으로 읽는다. */
export function formatDate(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}.${m}.${d}`;
}
```

- [ ] **Step 4: 테스트가 통과하는지 확인**

Run: `npm run test`
Expected: PASS — 15 tests passed

- [ ] **Step 5: `src/content.config.ts` 작성**

```typescript
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    cover: z.string().optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    stack: z.array(z.string()),
    repo: z.string().url().optional(),
    demo: z.string().url().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    cover: z.string().optional(),
  }),
});

export const collections = { blog, projects };
```

- [ ] **Step 6: 샘플 콘텐츠 작성**

`src/content/blog/ko/2026-08-07-hello.md`:

```markdown
---
title: "홈페이지를 만들었습니다"
description: "Astro로 개인 홈페이지를 만들면서 정한 것들에 대한 기록."
date: 2026-08-07
tags: ["웹", "회고"]
draft: false
---

첫 글입니다.

## 왜 만들었나

만든 것들이 여기저기 흩어져 있어서, 한곳에 모아두기로 했습니다.

## 어떻게 만들었나

마크다운 파일을 저장소에 넣으면 사이트가 되는 구조입니다. 글을 쓰는 데
집중할 수 있고, 백업은 git이 알아서 해줍니다.
```

`src/content/projects/ko/sample-project.md`:

```markdown
---
title: "샘플 프로젝트"
description: "구조 확인용 예시입니다. 실제 프로젝트로 교체하세요."
date: 2026-08-07
stack: ["TypeScript", "Astro"]
featured: true
draft: false
---

프로젝트 상세 설명이 들어갈 자리입니다.

## 배경

무엇을 해결하려 했는지 씁니다.

## 만든 것

어떻게 해결했는지 씁니다.
```

- [ ] **Step 7: 이미지 폴더 자리 잡기**

```bash
mkdir -p public/images/blog public/images/projects
touch public/images/blog/.gitkeep public/images/projects/.gitkeep
```

- [ ] **Step 8: 스키마가 콘텐츠를 통과시키는지 확인**

Run: `npm run build`
Expected: 오류 없이 종료

- [ ] **Step 9: 스키마가 잘못된 콘텐츠를 잡아내는지 확인**

`src/content/blog/ko/2026-08-07-hello.md` 에서 `description:` 줄을 잠시 지우고:

Run: `npm run build`
Expected: FAIL — `blog → ko/2026-08-07-hello` 항목에서 `description` 필수 필드 누락 오류. 파일을 특정할 수 있는 메시지가 나와야 한다.

확인했으면 `description:` 줄을 원래대로 복구하고 다시 `npm run build`가 통과하는지 확인한다.

- [ ] **Step 10: 커밋**

```bash
git add src/content.config.ts src/lib src/content public/images
git commit -m "feat: define content collections and query helpers"
```

---

## Task 4: 전역 스타일과 공통 레이아웃

이 태스크가 끝나면 헤더·푸터·다크모드가 붙은 소개 페이지가 눈에 보인다.

**Files:**
- Create: `src/styles/global.css`
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/Header.astro`, `Footer.astro`, `LangSwitcher.astro`, `ThemeToggle.astro`
- Create: `src/pages/about.astro`

**Interfaces:**
- Consumes: `useTranslations`, `defaultLang`, `languages` (Task 2)
- Produces:
  - `BaseLayout` props: `{ title: string; description?: string; image?: string }`
  - CSS 변수: `--bg`, `--fg`, `--muted`, `--accent`, `--border`, `--surface`
  - CSS 클래스: `.container`, `.prose`

- [ ] **Step 1: `src/styles/global.css` 작성**

```css
/* Pretendard 동적 서브셋 — 화면에 실제로 쓰인 글자 범위만 내려받는다 */
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.css');

:root {
  --bg: #ffffff;
  --fg: #1f2328;
  --muted: #656d76;
  --border: #d8dee4;
  --surface: #f6f8fa;
  --accent: #2563eb;

  --max-width: 44rem;
  --font-sans: 'Pretendard Variable', Pretendard, -apple-system,
    BlinkMacSystemFont, system-ui, 'Segoe UI', sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, 'SF Mono', Consolas,
    'Liberation Mono', monospace;
}

:root[data-theme='dark'] {
  --bg: #0d1117;
  --fg: #e6edf3;
  --muted: #9198a1;
  --border: #30363d;
  --surface: #161b22;
  --accent: #6ea8fe;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme='light']) {
    --bg: #0d1117;
    --fg: #e6edf3;
    --muted: #9198a1;
    --border: #30363d;
    --surface: #161b22;
    --accent: #6ea8fe;
  }
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--fg);
  font-family: var(--font-sans);
  font-size: 1rem;
  line-height: 1.75;
  -webkit-font-smoothing: antialiased;
}

a {
  color: var(--accent);
  text-decoration-thickness: 1px;
  text-underline-offset: 0.2em;
}

:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

img {
  max-width: 100%;
  height: auto;
}

code,
pre {
  font-family: var(--font-mono);
  font-size: 0.9em;
}

pre {
  padding: 1rem;
  overflow-x: auto;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 6px;
}

.container {
  width: 100%;
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 1.25rem;
}

.prose h2 {
  margin-top: 2.5rem;
  font-size: 1.35rem;
  line-height: 1.4;
}

.prose h3 {
  margin-top: 2rem;
  font-size: 1.15rem;
}

.prose blockquote {
  margin: 1.5rem 0;
  padding-left: 1rem;
  border-left: 3px solid var(--border);
  color: var(--muted);
}

.muted {
  color: var(--muted);
}
```

- [ ] **Step 2: `src/components/ThemeToggle.astro` 작성**

```astro
---
import { useTranslations } from '../i18n/utils';
import { defaultLang } from '../i18n/ui';

const t = useTranslations(defaultLang);
---

<button id="theme-toggle" type="button" aria-label={t('theme.toggle')}>
  <span aria-hidden="true">◐</span>
</button>

<style>
  button {
    padding: 0.25rem 0.5rem;
    background: none;
    border: 1px solid var(--border);
    border-radius: 6px;
    color: var(--fg);
    font-size: 0.9rem;
    line-height: 1;
    cursor: pointer;
  }
  button:hover {
    background: var(--surface);
  }
</style>

<script>
  const toggle = document.getElementById('theme-toggle');
  toggle?.addEventListener('click', () => {
    const root = document.documentElement;
    const isDark =
      root.dataset.theme === 'dark' ||
      (!root.dataset.theme &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);
    const next = isDark ? 'light' : 'dark';
    root.dataset.theme = next;
    localStorage.setItem('theme', next);
  });
</script>
```

- [ ] **Step 3: `src/components/LangSwitcher.astro` 작성**

```astro
---
import { languages } from '../i18n/ui';

// 활성 언어가 하나뿐이면 아무것도 그리지 않는다.
// ui.ts의 languages에 en을 추가하면 이 버튼이 자동으로 나타난다.
const entries = Object.entries(languages);
const show = entries.length > 1;
---

{
  show && (
    <nav class="langs">
      {entries.map(([code, label]) => (
        <a href={code === 'ko' ? '/' : `/${code}/`} hreflang={code}>
          {label}
        </a>
      ))}
    </nav>
  )
}

<style>
  .langs {
    display: flex;
    gap: 0.5rem;
    font-size: 0.85rem;
  }
</style>
```

- [ ] **Step 4: `src/components/Header.astro` 작성**

```astro
---
import { defaultLang } from '../i18n/ui';
import { useTranslations } from '../i18n/utils';
import LangSwitcher from './LangSwitcher.astro';
import ThemeToggle from './ThemeToggle.astro';

const t = useTranslations(defaultLang);
const path = Astro.url.pathname;

const links = [
  { href: '/about', key: 'nav.about' as const },
  { href: '/projects', key: 'nav.projects' as const },
  { href: '/blog', key: 'nav.blog' as const },
];

const isActive = (href: string) => path === href || path.startsWith(`${href}/`);
---

<header>
  <div class="container bar">
    <a class="brand" href="/">{t('site.title')}</a>
    <nav>
      {
        links.map((link) => (
          <a href={link.href} aria-current={isActive(link.href) ? 'page' : undefined}>
            {t(link.key)}
          </a>
        ))
      }
      <LangSwitcher />
      <ThemeToggle />
    </nav>
  </div>
</header>

<style>
  header {
    border-bottom: 1px solid var(--border);
  }
  .bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
  .brand {
    color: var(--fg);
    font-weight: 700;
    text-decoration: none;
  }
  nav {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 0.95rem;
  }
  nav a {
    color: var(--muted);
    text-decoration: none;
  }
  nav a:hover,
  nav a[aria-current='page'] {
    color: var(--fg);
  }
</style>
```

- [ ] **Step 5: `src/components/Footer.astro` 작성**

```astro
---
import { defaultLang } from '../i18n/ui';
import { useTranslations } from '../i18n/utils';

const t = useTranslations(defaultLang);
const year = new Date().getFullYear();
---

<footer>
  <div class="container inner">
    <span class="muted">© {year} {t('site.title')}</span>
    <nav>
      <a href="https://github.com/HaDoKim">GitHub</a>
      <a href="/rss.xml">{t('footer.rss')}</a>
    </nav>
  </div>
</footer>

<style>
  footer {
    margin-top: 4rem;
    padding: 2rem 0;
    border-top: 1px solid var(--border);
    font-size: 0.9rem;
  }
  .inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }
  nav {
    display: flex;
    gap: 1rem;
  }
</style>
```

- [ ] **Step 6: `src/layouts/BaseLayout.astro` 작성**

```astro
---
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import { defaultLang } from '../i18n/ui';
import { useTranslations } from '../i18n/utils';
import '../styles/global.css';

interface Props {
  title: string;
  description?: string;
  image?: string;
}

const t = useTranslations(defaultLang);
const { title, description = t('site.description'), image } = Astro.props;

const siteName = t('site.title');
const fullTitle = title === siteName ? siteName : `${title} · ${siteName}`;
const canonical = new URL(Astro.url.pathname, Astro.site);
const ogImage = image ? new URL(image, Astro.site) : undefined;
---

<!doctype html>
<html lang={defaultLang}>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" href="/favicon.svg" />
    <link rel="canonical" href={canonical} />
    <link
      rel="alternate"
      type="application/rss+xml"
      title={siteName}
      href="/rss.xml"
    />

    <title>{fullTitle}</title>
    <meta name="description" content={description} />

    <meta property="og:type" content="website" />
    <meta property="og:site_name" content={siteName} />
    <meta property="og:title" content={fullTitle} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonical} />
    {ogImage && <meta property="og:image" content={ogImage} />}
    <meta name="twitter:card" content={ogImage ? 'summary_large_image' : 'summary'} />

    <!-- 화면이 그려지기 전에 테마를 확정해 흰 화면 번쩍임을 막는다 -->
    <script is:inline>
      (function () {
        try {
          var saved = localStorage.getItem('theme');
          if (saved === 'dark' || saved === 'light') {
            document.documentElement.dataset.theme = saved;
          }
        } catch (e) {
          /* localStorage 차단 환경에서는 시스템 설정을 따른다 */
        }
      })();
    </script>
  </head>
  <body>
    <Header />
    <main class="container">
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

- [ ] **Step 7: `src/pages/about.astro` 작성**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { defaultLang } from '../i18n/ui';
import { useTranslations } from '../i18n/utils';

const t = useTranslations(defaultLang);
---

<BaseLayout title={t('nav.about')}>
  <article class="prose">
    <h1>{t('nav.about')}</h1>

    <p>
      안녕하세요. 만든 것과 배운 것을 여기에 기록합니다.
    </p>

    <h2>다루는 것</h2>
    <ul>
      <li>여기에 다루는 기술을 적습니다.</li>
    </ul>

    <h2>연락</h2>
    <p>
      <a href="https://github.com/HaDoKim">GitHub</a>
    </p>
  </article>
</BaseLayout>
```

> 이 페이지의 본문은 자리표시 문구다. 스펙 11절에 따라 사이트 완성 후 실제 내용으로 교체한다.

- [ ] **Step 8: 로컬에서 눈으로 확인**

Run: `npm run dev`

브라우저에서 `http://localhost:4321/about` 을 열고 확인한다.

- 헤더에 소개·프로젝트·블로그 링크가 보인다
- **언어 전환 버튼은 보이지 않는다** (활성 언어가 1개이므로)
- ◐ 버튼을 누르면 다크/라이트가 바뀐다
- 새로고침해도 방금 고른 테마가 유지되고, 흰 화면이 번쩍이지 않는다
- 한글이 Pretendard로 렌더된다

확인 후 `Ctrl+C` 로 종료한다.

- [ ] **Step 9: 빌드 확인**

Run: `npm run build`
Expected: 오류 없이 종료

Run: `node -e "const s=require('fs').readFileSync('dist/about/index.html','utf8'); for (const k of ['og:title','canonical','rss.xml']) { if(!s.includes(k)) throw new Error('missing: '+k); } if(s.includes('langs')) throw new Error('lang switcher rendered but should be hidden with a single locale'); console.log('OK')"`
Expected: `OK`

이 검사가 통과한다는 건 `LangSwitcher`가 실제로 아무것도 렌더하지 않았다는 뜻이다. `langs` 클래스는 그 컴포넌트에만 있으므로, 산출물에 나타나면 조건 분기가 잘못된 것이다.

- [ ] **Step 10: 커밋**

```bash
git add src/styles src/layouts src/components src/pages/about.astro
git commit -m "feat: add global styles, base layout, header and footer"
```

---

## Task 5: 블로그 목록과 글 상세

**Files:**
- Create: `src/components/PostCard.astro`
- Create: `src/layouts/PostLayout.astro`
- Create: `src/pages/blog/index.astro`
- Create: `src/pages/blog/[slug].astro`

**Interfaces:**
- Consumes: `BaseLayout` (Task 4), `slugOf`/`localeOf`/`filterVisible`/`byDateDesc`/`formatDate` (Task 3), `useTranslations` (Task 2)
- Produces:
  - `PostCard` props: `{ slug: string; title: string; description: string; date: Date; tags: string[] }`
  - `PostLayout` props: `{ title: string; description: string; date: Date; tags: string[]; cover?: string; prev?: { slug: string; title: string }; next?: { slug: string; title: string } }`
  - URL `/blog`, `/blog/<slug>`

- [ ] **Step 1: `src/components/PostCard.astro` 작성**

```astro
---
import { formatDate } from '../lib/content';

interface Props {
  slug: string;
  title: string;
  description: string;
  date: Date;
  tags: string[];
}

const { slug, title, description, date, tags } = Astro.props;
---

<article>
  <h3><a href={`/blog/${slug}`}>{title}</a></h3>
  <p class="muted desc">{description}</p>
  <p class="muted meta">
    <time datetime={date.toISOString()}>{formatDate(date)}</time>
    {tags.length > 0 && <span>· {tags.map((tag) => `#${tag}`).join(' ')}</span>}
  </p>
</article>

<style>
  article {
    padding: 1.5rem 0;
    border-bottom: 1px solid var(--border);
  }
  h3 {
    margin: 0 0 0.35rem;
    font-size: 1.15rem;
    line-height: 1.4;
  }
  h3 a {
    color: var(--fg);
    text-decoration: none;
  }
  h3 a:hover {
    color: var(--accent);
  }
  .desc {
    margin: 0 0 0.5rem;
  }
  .meta {
    margin: 0;
    font-size: 0.85rem;
  }
</style>
```

- [ ] **Step 2: `src/layouts/PostLayout.astro` 작성**

```astro
---
import BaseLayout from './BaseLayout.astro';
import { defaultLang } from '../i18n/ui';
import { useTranslations } from '../i18n/utils';
import { formatDate } from '../lib/content';

interface Props {
  title: string;
  description: string;
  date: Date;
  tags: string[];
  cover?: string;
  prev?: { slug: string; title: string };
  next?: { slug: string; title: string };
}

const t = useTranslations(defaultLang);
const { title, description, date, tags, cover, prev, next } = Astro.props;
---

<BaseLayout title={title} description={description} image={cover}>
  <article class="prose">
    <h1>{title}</h1>
    <p class="muted meta">
      <time datetime={date.toISOString()}>{formatDate(date)}</time>
    </p>

    {cover && <img src={cover} alt="" class="cover" />}

    <slot />

    {
      tags.length > 0 && (
        <nav class="tags" aria-label={t('post.tags')}>
          {tags.map((tag) => (
            <a href={`/blog/tags/${encodeURIComponent(tag)}`}>#{tag}</a>
          ))}
        </nav>
      )
    }
  </article>

  {
    (prev || next) && (
      <nav class="pager">
        <div>
          {prev && (
            <a href={`/blog/${prev.slug}`}>
              <span class="muted">{t('post.prev')}</span>
              <span>{prev.title}</span>
            </a>
          )}
        </div>
        <div class="right">
          {next && (
            <a href={`/blog/${next.slug}`}>
              <span class="muted">{t('post.next')}</span>
              <span>{next.title}</span>
            </a>
          )}
        </div>
      </nav>
    )
  }
</BaseLayout>

<style>
  h1 {
    margin-bottom: 0.25rem;
    font-size: 1.75rem;
    line-height: 1.35;
  }
  .meta {
    margin-top: 0;
    font-size: 0.9rem;
  }
  .cover {
    width: 100%;
    border-radius: 8px;
  }
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-top: 3rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--border);
    font-size: 0.9rem;
  }
  .pager {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-top: 2rem;
    font-size: 0.9rem;
  }
  .pager a {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    text-decoration: none;
  }
  .right {
    text-align: right;
  }
</style>
```

- [ ] **Step 3: `src/pages/blog/index.astro` 작성**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import PostCard from '../../components/PostCard.astro';
import { defaultLang } from '../../i18n/ui';
import { useTranslations } from '../../i18n/utils';
import { byDateDesc, filterVisible, localeOf, slugOf } from '../../lib/content';

const t = useTranslations(defaultLang);

const all = await getCollection('blog');
const posts = filterVisible(
  all.filter((entry) => localeOf(entry.id) === defaultLang),
  import.meta.env.DEV,
).sort(byDateDesc);
---

<BaseLayout title={t('nav.blog')}>
  <h1>{t('nav.blog')}</h1>

  {
    posts.length === 0 ? (
      <p class="muted">{t('blog.empty')}</p>
    ) : (
      posts.map((post) => (
        <PostCard
          slug={slugOf(post.id)}
          title={post.data.title}
          description={post.data.description}
          date={post.data.date}
          tags={post.data.tags}
        />
      ))
    )
  }
</BaseLayout>

<style>
  h1 {
    margin-bottom: 0.5rem;
    font-size: 1.6rem;
  }
</style>
```

- [ ] **Step 4: `src/pages/blog/[slug].astro` 작성**

이전/다음 글은 최신순 목록에서 앞뒤 항목으로 정한다. 목록에서 위에 있는 글이 `next`(더 최신), 아래가 `prev`(더 과거)다.

```astro
---
import type { GetStaticPaths } from 'astro';
import { getCollection, render } from 'astro:content';
import PostLayout from '../../layouts/PostLayout.astro';
import { defaultLang } from '../../i18n/ui';
import { byDateDesc, filterVisible, localeOf, slugOf } from '../../lib/content';

export const getStaticPaths: GetStaticPaths = async () => {
  const all = await getCollection('blog');
  const posts = filterVisible(
    all.filter((entry) => localeOf(entry.id) === defaultLang),
    import.meta.env.DEV,
  ).sort(byDateDesc);

  return posts.map((post, index) => {
    const newer = posts[index - 1];
    const older = posts[index + 1];
    return {
      params: { slug: slugOf(post.id) },
      props: {
        post,
        next: newer
          ? { slug: slugOf(newer.id), title: newer.data.title }
          : undefined,
        prev: older
          ? { slug: slugOf(older.id), title: older.data.title }
          : undefined,
      },
    };
  });
};

const { post, prev, next } = Astro.props;
const { Content } = await render(post);
---

<PostLayout
  title={post.data.title}
  description={post.data.description}
  date={post.data.date}
  tags={post.data.tags}
  cover={post.data.cover}
  prev={prev}
  next={next}
>
  <Content />
</PostLayout>
```

- [ ] **Step 5: 빌드하고 산출물 확인**

Run: `npm run build`
Expected: 오류 없이 종료

Run: `node -e "const fs=require('fs'); if(!fs.existsSync('dist/blog/index.html')) throw new Error('missing blog index'); if(!fs.existsSync('dist/blog/hello/index.html')) throw new Error('missing post page - slug derivation is wrong'); const s=fs.readFileSync('dist/blog/hello/index.html','utf8'); if(!s.includes('홈페이지를 만들었습니다')) throw new Error('title missing'); if(!s.includes('2026.08.07')) throw new Error('date format wrong'); console.log('OK')"`
Expected: `OK`

`dist/blog/hello/`가 만들어졌다는 건 slug에서 날짜 접두사가 제대로 떨어졌다는 뜻이다. `dist/blog/2026-08-07-hello/`가 나왔다면 `slugOf`가 잘못된 것이다.

- [ ] **Step 6: 초안이 프로덕션 빌드에서 빠지는지 확인**

임시 초안 파일 `src/content/blog/ko/2026-08-07-draft-test.md` 생성:

```markdown
---
title: "초안 테스트"
description: "이 글은 공개 빌드에 나오면 안 됩니다."
date: 2026-08-07
draft: true
---

초안 본문.
```

Run: `npm run build`

Run: `node -e "const fs=require('fs'); if(fs.existsSync('dist/blog/draft-test/index.html')) throw new Error('draft leaked into production build'); const s=fs.readFileSync('dist/blog/index.html','utf8'); if(s.includes('초안 테스트')) throw new Error('draft listed on index'); console.log('OK')"`
Expected: `OK`

확인 후 테스트 파일을 지운다:

```bash
rm src/content/blog/ko/2026-08-07-draft-test.md
```

- [ ] **Step 7: 커밋**

```bash
git add src/components/PostCard.astro src/layouts/PostLayout.astro src/pages/blog
git commit -m "feat: add blog list and post detail pages"
```

---

## Task 6: 태그 페이지

**Files:**
- Create: `src/components/TagList.astro`
- Create: `src/pages/blog/tags/[tag].astro`
- Modify: `src/pages/blog/index.astro` (태그 목록 추가)

**Interfaces:**
- Consumes: `PostCard` (Task 5), `BaseLayout` (Task 4), `src/lib/content` 헬퍼 (Task 3)
- Produces:
  - `TagList` props: `{ tags: { name: string; count: number }[]; active?: string }`
  - URL `/blog/tags/<tag>`

- [ ] **Step 1: `src/components/TagList.astro` 작성**

```astro
---
interface Props {
  tags: { name: string; count: number }[];
  active?: string;
}

const { tags, active } = Astro.props;
---

{
  tags.length > 0 && (
    <nav class="taglist">
      {tags.map((tag) => (
        <a
          href={`/blog/tags/${encodeURIComponent(tag.name)}`}
          aria-current={tag.name === active ? 'page' : undefined}
        >
          #{tag.name} <span class="muted">{tag.count}</span>
        </a>
      ))}
    </nav>
  )
}

<style>
  .taglist {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;
    font-size: 0.85rem;
  }
  .taglist a {
    padding: 0.2rem 0.6rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 999px;
    color: var(--fg);
    text-decoration: none;
  }
  .taglist a:hover,
  .taglist a[aria-current='page'] {
    border-color: var(--accent);
    color: var(--accent);
  }
</style>
```

- [ ] **Step 2: `src/pages/blog/index.astro` 에 태그 목록 붙이기**

frontmatter의 import 줄 아래에 태그 집계를 추가한다. `const posts = ...` 다음에 이어 붙인다:

```typescript
const tagCounts = new Map<string, number>();
for (const post of posts) {
  for (const tag of post.data.tags) {
    tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
  }
}
const tags = [...tagCounts.entries()]
  .map(([name, count]) => ({ name, count }))
  .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
```

import 목록에 `TagList`를 추가한다:

```typescript
import TagList from '../../components/TagList.astro';
```

그리고 `<h1>{t('nav.blog')}</h1>` 바로 아래에 넣는다:

```astro
  <TagList tags={tags} />
```

- [ ] **Step 3: `src/pages/blog/tags/[tag].astro` 작성**

```astro
---
import type { GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import BaseLayout from '../../../layouts/BaseLayout.astro';
import PostCard from '../../../components/PostCard.astro';
import TagList from '../../../components/TagList.astro';
import { defaultLang } from '../../../i18n/ui';
import { useTranslations } from '../../../i18n/utils';
import {
  byDateDesc,
  filterVisible,
  localeOf,
  slugOf,
} from '../../../lib/content';

export const getStaticPaths: GetStaticPaths = async () => {
  const all = await getCollection('blog');
  const posts = filterVisible(
    all.filter((entry) => localeOf(entry.id) === defaultLang),
    import.meta.env.DEV,
  ).sort(byDateDesc);

  const tagCounts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    }
  }

  const tags = [...tagCounts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

  return tags.map((tag) => ({
    params: { tag: tag.name },
    props: {
      tag: tag.name,
      tags,
      posts: posts.filter((post) => post.data.tags.includes(tag.name)),
    },
  }));
};

const t = useTranslations(defaultLang);
const { tag, tags, posts } = Astro.props;
---

<BaseLayout title={`#${tag}`} description={`${tag} 태그가 붙은 글 목록`}>
  <h1>{t('tags.heading')}</h1>
  <TagList tags={tags} active={tag} />

  {
    posts.map((post) => (
      <PostCard
        slug={slugOf(post.id)}
        title={post.data.title}
        description={post.data.description}
        date={post.data.date}
        tags={post.data.tags}
      />
    ))
  }
</BaseLayout>

<style>
  h1 {
    margin-bottom: 0.5rem;
    font-size: 1.6rem;
  }
</style>
```

- [ ] **Step 4: 빌드하고 산출물 확인**

Run: `npm run build`
Expected: 오류 없이 종료

Run: `node -e "const fs=require('fs'); const dirs=fs.readdirSync('dist/blog/tags'); if(dirs.length!==2) throw new Error('expected 2 tag pages, got '+dirs.length); const s=fs.readFileSync('dist/blog/index.html','utf8'); if(!s.includes('/blog/tags/')) throw new Error('tag list missing from blog index'); console.log('OK: '+dirs.sort().join(', '))"`
Expected: `OK:` 뒤에 태그 2개가 나온다. 샘플 글의 태그가 `웹`·`회고` 두 개이므로 폴더도 2개다. 폴더명은 한글 그대로일 수도 있고 URL 인코딩된 형태일 수도 있는데, 둘 다 정상이므로 개수만 확인한다.

- [ ] **Step 5: 커밋**

```bash
git add src/components/TagList.astro src/pages/blog
git commit -m "feat: add tag list and per-tag archive pages"
```

---

## Task 7: 프로젝트 목록과 상세

**Files:**
- Create: `src/components/ProjectCard.astro`
- Create: `src/layouts/ProjectLayout.astro`
- Create: `src/pages/projects/index.astro`
- Create: `src/pages/projects/[slug].astro`

**Interfaces:**
- Consumes: `BaseLayout` (Task 4), `src/lib/content` 헬퍼 (Task 3)
- Produces:
  - `ProjectCard` props: `{ slug: string; title: string; description: string; stack: string[]; cover?: string; featured: boolean }`
  - `ProjectLayout` props: `{ title: string; description: string; date: Date; stack: string[]; repo?: string; demo?: string; cover?: string }`
  - URL `/projects`, `/projects/<slug>`

- [ ] **Step 1: `src/components/ProjectCard.astro` 작성**

```astro
---
interface Props {
  slug: string;
  title: string;
  description: string;
  stack: string[];
  cover?: string;
  featured: boolean;
}

const { slug, title, description, stack, cover } = Astro.props;
---

<article>
  <a class="card" href={`/projects/${slug}`}>
    {cover && <img src={cover} alt="" />}
    <h3>{title}</h3>
    <p class="muted">{description}</p>
    <p class="stack muted">{stack.join(' · ')}</p>
  </a>
</article>

<style>
  .card {
    display: block;
    height: 100%;
    padding: 1.25rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    color: var(--fg);
    text-decoration: none;
  }
  .card:hover {
    border-color: var(--accent);
  }
  img {
    width: 100%;
    margin-bottom: 0.75rem;
    border-radius: 6px;
  }
  h3 {
    margin: 0 0 0.35rem;
    font-size: 1.05rem;
  }
  p {
    margin: 0 0 0.35rem;
    font-size: 0.9rem;
  }
  .stack {
    font-size: 0.8rem;
  }
</style>
```

- [ ] **Step 2: `src/layouts/ProjectLayout.astro` 작성**

```astro
---
import BaseLayout from './BaseLayout.astro';
import { defaultLang } from '../i18n/ui';
import { useTranslations } from '../i18n/utils';

interface Props {
  title: string;
  description: string;
  date: Date;
  stack: string[];
  repo?: string;
  demo?: string;
  cover?: string;
}

const t = useTranslations(defaultLang);
const { title, description, stack, repo, demo, cover } = Astro.props;
---

<BaseLayout title={title} description={description} image={cover}>
  <article class="prose">
    <h1>{title}</h1>
    <p class="muted">{description}</p>

    <dl class="meta">
      <dt>{t('project.stack')}</dt>
      <dd>{stack.join(' · ')}</dd>
    </dl>

    {
      (repo || demo) && (
        <nav class="links">
          {repo && <a href={repo}>{t('project.repo')}</a>}
          {demo && <a href={demo}>{t('project.demo')}</a>}
        </nav>
      )
    }

    {cover && <img src={cover} alt="" class="cover" />}

    <slot />
  </article>
</BaseLayout>

<style>
  h1 {
    margin-bottom: 0.25rem;
    font-size: 1.75rem;
    line-height: 1.35;
  }
  .meta {
    display: flex;
    gap: 0.5rem;
    margin: 1rem 0 0;
    font-size: 0.9rem;
  }
  .meta dt {
    color: var(--muted);
  }
  .meta dd {
    margin: 0;
  }
  .links {
    display: flex;
    gap: 1rem;
    margin-top: 0.75rem;
    font-size: 0.9rem;
  }
  .cover {
    width: 100%;
    margin-top: 1.5rem;
    border-radius: 8px;
  }
</style>
```

- [ ] **Step 3: `src/pages/projects/index.astro` 작성**

`featured`가 앞, 나머지가 뒤. 각 그룹 안에서는 `date` 최신순이다.

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import ProjectCard from '../../components/ProjectCard.astro';
import { defaultLang } from '../../i18n/ui';
import { useTranslations } from '../../i18n/utils';
import { byDateDesc, filterVisible, localeOf, slugOf } from '../../lib/content';

const t = useTranslations(defaultLang);

const all = await getCollection('projects');
const projects = filterVisible(
  all.filter((entry) => localeOf(entry.id) === defaultLang),
  import.meta.env.DEV,
).sort(byDateDesc);

const ordered = [
  ...projects.filter((p) => p.data.featured),
  ...projects.filter((p) => !p.data.featured),
];
---

<BaseLayout title={t('nav.projects')}>
  <h1>{t('nav.projects')}</h1>

  {
    ordered.length === 0 ? (
      <p class="muted">{t('projects.empty')}</p>
    ) : (
      <div class="grid">
        {ordered.map((project) => (
          <ProjectCard
            slug={slugOf(project.id)}
            title={project.data.title}
            description={project.data.description}
            stack={project.data.stack}
            cover={project.data.cover}
            featured={project.data.featured}
          />
        ))}
      </div>
    )
  }
</BaseLayout>

<style>
  h1 {
    margin-bottom: 1rem;
    font-size: 1.6rem;
  }
  .grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  @media (min-width: 40rem) {
    .grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>
```

- [ ] **Step 4: `src/pages/projects/[slug].astro` 작성**

```astro
---
import type { GetStaticPaths } from 'astro';
import { getCollection, render } from 'astro:content';
import ProjectLayout from '../../layouts/ProjectLayout.astro';
import { defaultLang } from '../../i18n/ui';
import { filterVisible, localeOf, slugOf } from '../../lib/content';

export const getStaticPaths: GetStaticPaths = async () => {
  const all = await getCollection('projects');
  const projects = filterVisible(
    all.filter((entry) => localeOf(entry.id) === defaultLang),
    import.meta.env.DEV,
  );

  return projects.map((project) => ({
    params: { slug: slugOf(project.id) },
    props: { project },
  }));
};

const { project } = Astro.props;
const { Content } = await render(project);
---

<ProjectLayout
  title={project.data.title}
  description={project.data.description}
  date={project.data.date}
  stack={project.data.stack}
  repo={project.data.repo}
  demo={project.data.demo}
  cover={project.data.cover}
>
  <Content />
</ProjectLayout>
```

- [ ] **Step 5: 빌드하고 산출물 확인**

Run: `npm run build`
Expected: 오류 없이 종료

Run: `node -e "const fs=require('fs'); if(!fs.existsSync('dist/projects/index.html')) throw new Error('missing projects index'); if(!fs.existsSync('dist/projects/sample-project/index.html')) throw new Error('missing project detail'); const s=fs.readFileSync('dist/projects/sample-project/index.html','utf8'); if(!s.includes('사용 기술')) throw new Error('stack label missing'); if(s.includes('저장소')) throw new Error('repo link should be absent when repo is not set'); console.log('OK')"`
Expected: `OK`

샘플 프로젝트에는 `repo`가 없으므로 저장소 버튼이 나오면 안 된다. 나온다면 조건부 렌더링이 잘못된 것이다.

- [ ] **Step 6: 커밋**

```bash
git add src/components/ProjectCard.astro src/layouts/ProjectLayout.astro src/pages/projects
git commit -m "feat: add project list and detail pages"
```

---

## Task 8: 홈

**Files:**
- Modify: `src/pages/index.astro` (Task 1의 임시 페이지를 완전히 대체)

**Interfaces:**
- Consumes: `BaseLayout` (4), `PostCard` (5), `ProjectCard` (7), `topN`/`byDateDesc`/`filterVisible`/`localeOf`/`slugOf` (3)
- Produces: URL `/`

- [ ] **Step 1: `src/pages/index.astro` 전체 교체**

스펙 4절 규칙 5에 따라 각 3개로 고정한다. `featured` 프로젝트가 3개를 넘으면 최신순 상위 3개만 나온다.

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../layouts/BaseLayout.astro';
import PostCard from '../components/PostCard.astro';
import ProjectCard from '../components/ProjectCard.astro';
import { defaultLang } from '../i18n/ui';
import { useTranslations } from '../i18n/utils';
import {
  byDateDesc,
  filterVisible,
  localeOf,
  slugOf,
  topN,
} from '../lib/content';

const t = useTranslations(defaultLang);
const includeDrafts = import.meta.env.DEV;

const allPosts = await getCollection('blog');
const posts = topN(
  filterVisible(
    allPosts.filter((entry) => localeOf(entry.id) === defaultLang),
    includeDrafts,
  ).sort(byDateDesc),
  3,
);

const allProjects = await getCollection('projects');
const projects = topN(
  filterVisible(
    allProjects.filter((entry) => localeOf(entry.id) === defaultLang),
    includeDrafts,
  )
    .filter((entry) => entry.data.featured)
    .sort(byDateDesc),
  3,
);
---

<BaseLayout title={t('site.title')}>
  <section class="intro">
    <h1>{t('site.title')}</h1>
    <p class="muted">{t('site.description')}</p>
    <p class="links">
      <a href="https://github.com/HaDoKim">GitHub</a>
      <a href="/about">{t('nav.about')}</a>
    </p>
  </section>

  {
    projects.length > 0 && (
      <section>
        <div class="head">
          <h2>{t('home.featured')}</h2>
          <a href="/projects">{t('home.more.projects')}</a>
        </div>
        <div class="grid">
          {projects.map((project) => (
            <ProjectCard
              slug={slugOf(project.id)}
              title={project.data.title}
              description={project.data.description}
              stack={project.data.stack}
              cover={project.data.cover}
              featured={project.data.featured}
            />
          ))}
        </div>
      </section>
    )
  }

  {
    posts.length > 0 && (
      <section>
        <div class="head">
          <h2>{t('home.recent')}</h2>
          <a href="/blog">{t('home.more.blog')}</a>
        </div>
        {posts.map((post) => (
          <PostCard
            slug={slugOf(post.id)}
            title={post.data.title}
            description={post.data.description}
            date={post.data.date}
            tags={post.data.tags}
          />
        ))}
      </section>
    )
  }
</BaseLayout>

<style>
  .intro {
    padding: 2.5rem 0 1rem;
  }
  .intro h1 {
    margin: 0 0 0.5rem;
    font-size: 2rem;
  }
  .intro p {
    margin: 0 0 0.5rem;
  }
  .links {
    display: flex;
    gap: 1rem;
    font-size: 0.9rem;
  }
  section + section {
    margin-top: 3rem;
  }
  .head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--border);
  }
  .head h2 {
    margin: 0;
    font-size: 1.2rem;
  }
  .head a {
    font-size: 0.85rem;
  }
  .grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-top: 1rem;
  }
  @media (min-width: 40rem) {
    .grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>
```

- [ ] **Step 2: 빌드하고 산출물 확인**

Run: `npm run build`
Expected: 오류 없이 종료

Run: `node -e "const s=require('fs').readFileSync('dist/index.html','utf8'); if(s.includes('DEPLOY_OK')) throw new Error('temporary page was not replaced'); for (const k of ['주요 프로젝트','최근 글','/blog/hello','/projects/sample-project']) { if(!s.includes(k)) throw new Error('missing: '+k); } console.log('OK')"`
Expected: `OK`

- [ ] **Step 3: 커밋**

```bash
git add src/pages/index.astro
git commit -m "feat: build home page with featured projects and recent posts"
```

---

## Task 9: 404·RSS·사이트맵

**Files:**
- Create: `src/pages/404.astro`
- Create: `src/pages/rss.xml.ts`
- Verify: 사이트맵 (Task 1에서 통합은 이미 등록됨)

**Interfaces:**
- Consumes: `BaseLayout` (4), `src/lib/content` 헬퍼 (3), `useTranslations` (2)
- Produces: URL `/404.html`, `/rss.xml`, `/sitemap-index.xml`

- [ ] **Step 1: `src/pages/404.astro` 작성**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { defaultLang } from '../i18n/ui';
import { useTranslations } from '../i18n/utils';

const t = useTranslations(defaultLang);
---

<BaseLayout title={t('notfound.title')}>
  <section>
    <h1>404</h1>
    <p>{t('notfound.title')}</p>
    <p class="muted">{t('notfound.body')}</p>
    <p class="links">
      <a href="/">{t('notfound.home')}</a>
      <a href="/blog">{t('notfound.blog')}</a>
    </p>
  </section>
</BaseLayout>

<style>
  section {
    padding: 4rem 0;
    text-align: center;
  }
  h1 {
    margin: 0;
    font-size: 3rem;
  }
  .links {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
  }
</style>
```

- [ ] **Step 2: `src/pages/rss.xml.ts` 작성**

```typescript
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { defaultLang, ui } from '../i18n/ui';
import { byDateDesc, filterVisible, localeOf, slugOf } from '../lib/content';

export async function GET(context: APIContext) {
  const all = await getCollection('blog');
  const posts = filterVisible(
    all.filter((entry) => localeOf(entry.id) === defaultLang),
    false,
  ).sort(byDateDesc);

  return rss({
    title: ui[defaultLang]['site.title'],
    description: ui[defaultLang]['site.description'],
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/blog/${slugOf(post.id)}/`,
    })),
    customData: `<language>ko</language>`,
  });
}
```

RSS는 항상 초안을 제외한다 (`includeDrafts`에 `false` 고정). 피드 구독자에게 초안이 나가면 되돌릴 수 없다.

- [ ] **Step 3: 빌드하고 산출물 확인**

Run: `npm run build`
Expected: 오류 없이 종료

Run: `node -e "const fs=require('fs'); for (const f of ['dist/404.html','dist/rss.xml','dist/sitemap-index.xml']) { if(!fs.existsSync(f)) throw new Error('missing: '+f); } const r=fs.readFileSync('dist/rss.xml','utf8'); if(!r.includes('https://hadokim.github.io/blog/hello/')) throw new Error('rss link is not absolute or slug is wrong'); const sm=fs.readFileSync('dist/sitemap-index.xml','utf8'); if(!sm.includes('hadokim.github.io')) throw new Error('sitemap site url wrong'); console.log('OK')"`
Expected: `OK`

- [ ] **Step 4: 초안이 RSS에 새지 않는지 확인**

Task 5 Step 6의 초안 파일을 다시 만든다:

```markdown
---
title: "초안 테스트"
description: "이 글은 피드에 나오면 안 됩니다."
date: 2026-08-07
draft: true
---

초안 본문.
```

`src/content/blog/ko/2026-08-07-draft-test.md` 로 저장한 뒤:

Run: `npm run build`

Run: `node -e "const s=require('fs').readFileSync('dist/rss.xml','utf8'); if(s.includes('초안 테스트')) throw new Error('draft leaked into RSS'); console.log('OK')"`
Expected: `OK`

```bash
rm src/content/blog/ko/2026-08-07-draft-test.md
```

- [ ] **Step 5: 커밋**

```bash
git add src/pages/404.astro src/pages/rss.xml.ts
git commit -m "feat: add 404 page, RSS feed and sitemap"
```

---

## Task 10: 전체 검증과 배포

**Files:**
- Create: `README.md`

**Interfaces:**
- Consumes: 전체
- Produces: 공개된 사이트

- [ ] **Step 1: 전체 테스트와 빌드**

Run: `npm run test`
Expected: PASS — 15 tests passed (i18n 4개 + content 11개)

Run: `npm run build`
Expected: 오류 없이 종료

- [ ] **Step 2: 생성된 페이지 전수 확인**

Run: `node -e "const fs=require('fs'); const want=['dist/index.html','dist/about/index.html','dist/404.html','dist/rss.xml','dist/sitemap-index.xml','dist/blog/index.html','dist/blog/hello/index.html','dist/projects/index.html','dist/projects/sample-project/index.html']; const missing=want.filter(f=>!fs.existsSync(f)); if(missing.length) throw new Error('missing: '+missing.join(', ')); console.log('OK: '+want.length+' outputs')"`
Expected: `OK: 9 outputs`

- [ ] **Step 3: 로컬 프로덕션 미리보기로 눈 확인**

Run: `npm run preview`

`http://localhost:4321` 에서 확인한다:

- 홈에 주요 프로젝트와 최근 글이 보인다
- 헤더 링크가 모두 동작한다 (소개·프로젝트·블로그)
- 글 상세에서 태그를 누르면 태그 페이지로 간다
- 없는 주소(`/nope`)로 가면 404 페이지가 나온다
- 다크모드 전환이 유지된다
- 창을 모바일 폭(375px)으로 줄여도 가로 스크롤이 생기지 않는다

`Ctrl+C` 로 종료한다.

- [ ] **Step 4: `README.md` 작성**

```markdown
# hadokim.github.io

개인 홈페이지. 포트폴리오와 블로그.

- 공개 주소: https://hadokim.github.io
- 설계 문서: `docs/superpowers/specs/2026-08-07-personal-homepage-design.md`

## 로컬 실행

```bash
npm install
npm run dev
```

## 글 쓰기

`src/content/blog/ko/YYYY-MM-DD-slug.md` 파일을 만든다.

```markdown
---
title: "제목"
description: "한 줄 요약"
date: 2026-08-07
tags: ["태그"]
draft: false
---

본문
```

- 주소는 `/blog/slug` 가 된다 (날짜 접두사는 주소에서 빠진다)
- `draft: true` 면 공개 사이트에 나오지 않는다. `npm run dev` 에서는 보인다
- slug 에는 소문자 영문·숫자·하이픈만 쓴다

프로젝트는 `src/content/projects/ko/slug.md` 에 같은 방식으로 쓴다.
`featured: true` 를 주면 홈에 노출된다 (최신순 3개까지).

## 배포

`main` 에 push 하면 GitHub Actions 가 빌드해 Pages 에 올린다. 2~3분 걸린다.
빌드가 실패하면 배포되지 않는다.

## 명령

| 명령 | 하는 일 |
|---|---|
| `npm run dev` | 로컬 개발 서버 |
| `npm run build` | 타입 검사 후 정적 빌드 |
| `npm run preview` | 빌드 결과 미리보기 |
| `npm run test` | 순수 함수 테스트 |
```

- [ ] **Step 5: 커밋과 배포**

```bash
git add README.md
git commit -m "docs: add README with authoring and deploy instructions"
git push
```

- [ ] **Step 6: 배포 결과 확인**

저장소 Actions 탭에서 워크플로가 초록색으로 끝나는지 확인한다.

Run: `curl -s -o /dev/null -w "%{http_code}" https://hadokim.github.io`
Expected: `200`

Run: `curl -s https://hadokim.github.io/blog/hello/ | grep -c "홈페이지를 만들었습니다"`
Expected: `1`

Run: `curl -s -o /dev/null -w "%{http_code}" https://hadokim.github.io/rss.xml`
Expected: `200`

- [ ] **Step 7: 사용자에게 콘텐츠 교체 안내**

배포가 확인되면 아래를 사용자에게 알리고 실제 내용을 받는다. 스펙 11절의 자리표시 항목이다.

| 교체할 것 | 파일 |
|---|---|
| 사이트 이름·한 줄 소개 | `src/i18n/ui.ts` 의 `site.title`, `site.description` |
| 소개 페이지 본문 | `src/pages/about.astro` |
| 첫 프로젝트 | `src/content/projects/ko/sample-project.md` 를 실제 프로젝트로 교체 |
| 첫 글 | `src/content/blog/ko/2026-08-07-hello.md` |
| 연락처 | `src/components/Footer.astro`, `src/pages/index.astro` 의 링크 |
| 포인트 색 | `src/styles/global.css` 의 `--accent` (라이트/다크 각각) |

---

## 자체 검토 결과

**스펙 커버리지.** 스펙 각 절을 태스크에 대응시켰다.

| 스펙 | 태스크 |
|---|---|
| 3절 URL 체계 | 1(설정), 5(블로그), 6(태그), 7(프로젝트), 8(홈), 9(404·RSS·사이트맵) |
| 3절 저장소 이름·base 미설정 | 1 |
| 3절 페이지별 내용 | 5, 7, 8 |
| 3절 헤더·푸터·언어 전환 | 4 |
| 4절 콘텐츠 폴더·파일명·slug | 3 |
| 4절 frontmatter 스키마 | 3 |
| 4절 규칙 1 (draft) | 3, 5 Step 6, 9 Step 4 |
| 4절 규칙 3 (스키마 검증) | 3 Step 9 |
| 4절 규칙 5 (홈 3개 고정) | 8 |
| 5절 영어 확장 3장치 | 1(URL), 3(폴더), 2(문구 분리) |
| 6절 디렉터리·컴포넌트 경계 | 전 태스크 |
| 7절 빌드 검증·404 | 1, 9 |
| 8절 폰트·다크모드·접근성 | 4 |
| 9절 RSS·사이트맵·OG | 9(RSS·사이트맵), 4(OG) |
| 11절 자리표시 교체 | 10 Step 7 |

빠진 요구사항 없음.

**타입 일관성.** `slugOf`·`localeOf`·`filterVisible`·`byDateDesc`·`topN`·`formatDate` 이름이 Task 3 정의와 이후 사용처에서 일치한다. `useTranslations`의 반환 함수 `t`도 전 태스크에서 동일하다. `BaseLayout` props(`title`/`description`/`image`)는 Task 4 정의와 5·7·8·9 사용처가 일치한다. 콘텐츠 엔트리 접근은 전부 `entry.id`(Astro 7 기준)로 통일했다.

**플레이스홀더.** 코드 단계는 모두 실제 코드를 담고 있다. `about.astro`와 샘플 콘텐츠의 본문은 스펙 11절이 명시한 자리표시로, Task 10 Step 7에서 교체 대상으로 추적된다.
