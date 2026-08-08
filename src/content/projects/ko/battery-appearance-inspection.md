---
title: "이차전지 외관 검사 장비"
description: "파우치형 이차전지의 외관 이미지를 획득해 양불을 판정하는 장비. 비전 결과를 취합해 판정하는 호스트 프로그램과 작업자 검토 프로그램을 담당했습니다."
date: 2022-12-01
stack: ["Visual C++", "MFC", "C#", "MariaDB", "Vision", "MES"]
featured: true
draft: false
---

파우치형 이차전지의 외관 이미지를 획득해 양불을 판정하는 검사 장비입니다.

<figure>
<svg viewBox="0 0 680 300" role="img" aria-label="비전 모듈 세 대가 부분 판정을 호스트로 보내고, 호스트가 최종 판정을 내려 결과를 MES로 보고한다. 불량으로 판정된 건은 아래쪽 Review 프로그램으로 내려가 작업자가 확인한 뒤 재판정 결과가 호스트로 되돌아온다">
  <defs>
    <marker id="ap-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
    </marker>
  </defs>

  <rect x="30" y="16" width="110" height="44" rx="6" fill="none" stroke="currentColor" opacity="0.65" />
  <text x="85" y="43" text-anchor="middle" font-size="13" fill="currentColor">비전 1</text>

  <rect x="160" y="16" width="110" height="44" rx="6" fill="none" stroke="currentColor" opacity="0.65" />
  <text x="215" y="43" text-anchor="middle" font-size="13" fill="currentColor">비전 2</text>

  <rect x="290" y="16" width="110" height="44" rx="6" fill="none" stroke="currentColor" opacity="0.65" />
  <text x="345" y="43" text-anchor="middle" font-size="13" fill="currentColor">비전 3</text>

  <line x1="85" y1="60" x2="85" y2="114" stroke="currentColor" marker-end="url(#ap-a)" />
  <line x1="215" y1="60" x2="215" y2="114" stroke="currentColor" marker-end="url(#ap-a)" />
  <line x1="345" y1="60" x2="345" y2="114" stroke="currentColor" marker-end="url(#ap-a)" />
  <text x="360" y="93" font-size="12" fill="currentColor" opacity="0.7">부분 판정</text>

  <rect x="30" y="120" width="370" height="52" rx="6" fill="none" stroke="currentColor" />
  <text x="215" y="151" text-anchor="middle" font-size="13" fill="currentColor">호스트 프로그램 — 최종 판정</text>

  <line x1="400" y1="146" x2="462" y2="146" stroke="currentColor" marker-end="url(#ap-a)" />
  <text x="431" y="136" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.7">결과 보고</text>

  <rect x="470" y="120" width="180" height="52" rx="6" fill="none" stroke="currentColor" opacity="0.65" />
  <text x="560" y="151" text-anchor="middle" font-size="13" fill="currentColor">MES</text>

  <line x1="180" y1="172" x2="180" y2="222" stroke="currentColor" marker-end="url(#ap-a)" />
  <text x="172" y="200" text-anchor="end" font-size="12" fill="currentColor" opacity="0.7">불량 건</text>

  <line x1="250" y1="222" x2="250" y2="178" stroke="currentColor" marker-end="url(#ap-a)" />
  <text x="258" y="200" font-size="12" style="fill:var(--accent)">재판정</text>

  <rect x="125" y="228" width="180" height="48" rx="6" fill="none" style="stroke:var(--accent)" stroke-width="2" />
  <text x="215" y="257" text-anchor="middle" font-size="13" style="fill:var(--accent)">Review 프로그램</text>
</svg>
<figcaption>
비전의 판정을 그대로 흘려보내면 과검·미검이 그대로 수율에 반영됩니다. 강조된 경로가
작업자가 판단을 되돌릴 수 있는 통로입니다.
</figcaption>
</figure>

## 맡은 일

**호스트 프로그램 개발.** 여러 비전 모듈이 각각 검사한 결과를 한곳에 모아 최종 판정을
내리는 본체 프로그램입니다. 개별 비전이 내는 판정은 부분 정보이므로, 이를 어떤 기준으로
합쳐 하나의 양불로 확정할지가 이 프로그램의 핵심이었습니다.

**Review 프로그램 개발.** 불량으로 판정된 건을 작업자가 다시 확인하는 프로그램입니다.
사람이 이미지를 빠르게 훑고 판단을 뒤집을 수 있어야 했습니다.

**MES 유지보수.** 기존 MES 연동 부분을 이어받아 유지보수했습니다.

## 사용 기술

Visual C++ / MFC, C#, MariaDB, Vision, MES
