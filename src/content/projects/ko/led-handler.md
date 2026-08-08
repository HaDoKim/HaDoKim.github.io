---
title: "LED Handler"
description: "LED 칩의 특성을 검사해 등급별로 분류하는 장비. 장비 제어 시퀀스와 운영 UI를 담당했습니다."
date: 2008-10-01
stack: ["Visual C++", "MFC", "Motion", "DIO"]
featured: false
draft: false
---

LED 칩의 전기적·광학적 특성을 검사하고, 그 결과에 따라 등급별로 분류하는 장비입니다.
Tester가 매긴 등급을 받아 실제로 칩을 옮기고 나누는 쪽을 맡습니다.

<figure>
<svg viewBox="0 0 680 280" role="img" aria-label="칩이 투입되어 이송된 뒤 접촉 단계에서 Tester와 측정을 주고받고, 받은 등급대로 분류 배출된다. 이송과 접촉은 PC 기반 모션과 디지털 입출력 제어가 담당한다">
  <defs>
    <marker id="lh-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
    </marker>
  </defs>

  <rect x="400" y="20" width="130" height="44" rx="6" fill="none" stroke="currentColor" opacity="0.65" />
  <text x="465" y="47" text-anchor="middle" font-size="13" fill="currentColor">Tester</text>

  <rect x="20" y="108" width="90" height="48" rx="6" fill="none" stroke="currentColor" opacity="0.85" />
  <text x="65" y="137" text-anchor="middle" font-size="13" fill="currentColor">투입</text>

  <line x1="110" y1="132" x2="146" y2="132" stroke="currentColor" marker-end="url(#lh-a)" />

  <rect x="150" y="108" width="90" height="48" rx="6" fill="none" stroke="currentColor" opacity="0.85" />
  <text x="195" y="137" text-anchor="middle" font-size="13" fill="currentColor">이송</text>

  <line x1="240" y1="132" x2="276" y2="132" stroke="currentColor" marker-end="url(#lh-a)" />

  <rect x="280" y="104" width="120" height="56" rx="6" fill="none" style="stroke:var(--accent)" stroke-width="2" />
  <text x="340" y="128" text-anchor="middle" font-size="13" style="fill:var(--accent)">접촉</text>
  <text x="340" y="146" text-anchor="middle" font-size="11" style="fill:var(--accent)">Contact 제어</text>

  <line x1="380" y1="104" x2="430" y2="68" stroke="currentColor" marker-start="url(#lh-a)" marker-end="url(#lh-a)" />
  <text x="418" y="94" font-size="11" fill="currentColor" opacity="0.7">측정</text>

  <line x1="510" y1="64" x2="545" y2="104" stroke="currentColor" marker-end="url(#lh-a)" />
  <text x="546" y="82" font-size="11" fill="currentColor" opacity="0.7">등급</text>

  <rect x="530" y="108" width="120" height="48" rx="6" fill="none" stroke="currentColor" opacity="0.85" />
  <text x="590" y="137" text-anchor="middle" font-size="13" fill="currentColor">분류 배출</text>

  <line x1="195" y1="206" x2="195" y2="162" stroke="currentColor" marker-end="url(#lh-a)" />
  <line x1="340" y1="206" x2="340" y2="166" stroke="currentColor" marker-end="url(#lh-a)" />

  <rect x="150" y="212" width="250" height="48" rx="6" fill="none" stroke="currentColor" opacity="0.8" />
  <text x="275" y="241" text-anchor="middle" font-size="13" fill="currentColor">PC 기반 Motion · DIO 제어</text>
</svg>
<figcaption>
접촉이 제대로 되지 않으면 측정값 자체를 신뢰할 수 없습니다. 강조된 접촉 제어가 이
장비에서 가장 신경 쓴 부분입니다.
</figcaption>
</figure>

## 맡은 일

**장비 제어 시퀀스 개발.** 칩을 측정 가능한 위치로 옮기고, 접촉시켜 측정하고, 정해진
등급 위치로 분류하기까지의 흐름을 제어했습니다.

**운영 UI 프로그램 개발.** 작업자가 장비 상태를 확인하고 조작하는 화면을 개발했습니다.

**PC 기반 Motion · I/O 제어.** 별도 컨트롤러가 아니라 PC에서 모션과 I/O를 직접
제어하는 구조로 개발했습니다.

## 사용 기술

Visual C++ (Visual Studio), Motion · DIO 제어
