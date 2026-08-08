---
title: "이차전지 노칭 검사 비전"
description: "전극 노칭 공정에서 외관 불량과 치수를 검사하는 비전 시스템. PLC 3사 인터페이스와 상위 시스템 연동을 담당했습니다."
date: 2023-11-01
stack: ["Visual C++", "MFC", "PLC", "SPC+", "JSON"]
featured: true
draft: false
---

이차전지 양·음극 전극을 노칭하는 공정에서, 외관 불량을 잡아내고 치수를 측정하는
검사 비전 시스템입니다.

<figure>
<svg viewBox="0 0 680 310" role="img" aria-label="비전 모듈 세 대가 검사 결과를 호스트 프로그램으로 보내고, 호스트는 판정을 SPC+로 전송하며, 아래쪽 PLC 인터페이스 계층이 미쓰비시·옴론·지멘스 세 제조사의 프로토콜 차이를 흡수한다">
  <defs>
    <marker id="nk-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
    </marker>
  </defs>

  <rect x="30" y="20" width="110" height="44" rx="6" fill="none" stroke="currentColor" opacity="0.65" />
  <text x="85" y="47" text-anchor="middle" font-size="13" fill="currentColor">비전 1</text>

  <rect x="160" y="20" width="110" height="44" rx="6" fill="none" stroke="currentColor" opacity="0.65" />
  <text x="215" y="47" text-anchor="middle" font-size="13" fill="currentColor">비전 2</text>

  <rect x="290" y="20" width="110" height="44" rx="6" fill="none" stroke="currentColor" opacity="0.65" />
  <text x="345" y="47" text-anchor="middle" font-size="13" fill="currentColor">비전 3</text>

  <line x1="85" y1="64" x2="85" y2="124" stroke="currentColor" marker-end="url(#nk-a)" />
  <line x1="215" y1="64" x2="215" y2="124" stroke="currentColor" marker-end="url(#nk-a)" />
  <line x1="345" y1="64" x2="345" y2="124" stroke="currentColor" marker-end="url(#nk-a)" />
  <text x="360" y="100" font-size="12" fill="currentColor" opacity="0.7">검사 결과</text>

  <rect x="30" y="130" width="370" height="52" rx="6" fill="none" stroke="currentColor" />
  <text x="215" y="161" text-anchor="middle" font-size="13" fill="currentColor">호스트 프로그램 — 취합 · 판정</text>

  <line x1="400" y1="156" x2="462" y2="156" stroke="currentColor" marker-end="url(#nk-a)" />
  <text x="431" y="146" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.7">JSON</text>

  <rect x="470" y="130" width="180" height="52" rx="6" fill="none" stroke="currentColor" opacity="0.65" />
  <text x="560" y="161" text-anchor="middle" font-size="13" fill="currentColor">SPC+</text>

  <line x1="215" y1="182" x2="215" y2="222" stroke="currentColor" marker-end="url(#nk-a)" />
  <text x="230" y="207" font-size="12" fill="currentColor" opacity="0.7">장비 신호</text>

  <rect x="30" y="228" width="370" height="48" rx="6" fill="none" style="stroke:var(--accent)" stroke-width="2" />
  <text x="215" y="257" text-anchor="middle" font-size="13" style="fill:var(--accent)">PLC 인터페이스 계층</text>

  <text x="85" y="298" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.6">Mitsubishi</text>
  <text x="215" y="298" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.6">OMRON</text>
  <text x="345" y="298" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.6">SIEMENS</text>
</svg>
<figcaption>
라인 구성에 따라 PLC 제조사가 섞여 들어왔습니다. 강조된 인터페이스 계층이 프로토콜
차이를 흡수하므로, PLC가 바뀌어도 호스트 프로그램은 손대지 않습니다.
</figcaption>
</figure>

## 맡은 일

**호스트 프로그램 개발.** 검사 시퀀스를 관리하고 검사 결과를 판정·기록하는 본체
프로그램을 만들었습니다.

**PLC 통신 API 개발.** 이 프로젝트에서 까다로웠던 부분입니다. 라인 구성에 따라
Mitsubishi, OMRON, SIEMENS 세 제조사의 PLC가 섞여 들어왔는데, 프로토콜이 제각각이라
호스트 쪽 코드가 PLC 종류를 알지 않아도 되도록 통신 계층을 분리했습니다.

**상위 시스템(SPC+) 연동.** 검사 데이터를 공정 관리 시스템으로 올려보내는 API를
JSON 기반으로 개발했습니다.

## 사용 기술

Visual C++ / MFC, PLC 통신(Mitsubishi · OMRON · SIEMENS), JSON, SPC+
