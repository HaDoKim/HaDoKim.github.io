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
- `draft: true` 면 공개 사이트에 나오지 않는다. `npm run dev` 에서는 보인다. 단, RSS(`/rss.xml`)는 `npm run dev` 를 포함해 항상 draft 글을 제외한다
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
