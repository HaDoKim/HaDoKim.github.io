---
title: "LED Tester"
description: "LED 칩의 전기적·광학적 특성을 측정하는 측정기. 측정값 표시 UI와 상위 보고 프로그램을 담당했습니다."
date: 2011-11-01
stack: ["Visual C++", "MFC", "MES"]
featured: false
draft: false
---

LED 칩의 전기적·광학적 특성을 측정하는 측정기입니다. 측정 결과가 곧 등급 판정의
근거가 되고, 그 등급대로 분류 장비가 움직이기 때문에 측정값의 정확성과 전달이
이 장비의 전부였습니다.

단채널부터 다채널, 고출력용, AC 측정용, 테이핑 연계용까지 여러 기종을 개발했습니다.

<figure>
<svg viewBox="0 0 680 300" role="img" aria-label="사용자가 측정 항목을 설정하면 그 정의에 따라 전기 측정과 광학 측정이 수행된다. 두 측정 결과를 합쳐 등급을 판정하고, 등급 정보는 분류 장비로, 측정 결과는 MES로 전달된다">
  <defs>
    <marker id="lt-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
    </marker>
  </defs>

  <rect x="20" y="16" width="200" height="48" rx="6" fill="none" style="stroke:var(--accent)" stroke-width="2" />
  <text x="120" y="38" text-anchor="middle" font-size="13" style="fill:var(--accent)">측정 항목 설정</text>
  <text x="120" y="55" text-anchor="middle" font-size="11" style="fill:var(--accent)">사용자가 기종별로 정의</text>

  <line x1="120" y1="64" x2="120" y2="104" stroke="currentColor" marker-end="url(#lt-a)" />
  <text x="132" y="88" font-size="11" style="fill:var(--accent)">항목 정의</text>

  <rect x="20" y="110" width="200" height="44" rx="6" fill="none" stroke="currentColor" opacity="0.85" />
  <text x="120" y="137" text-anchor="middle" font-size="13" fill="currentColor">DC · AC 전기 측정</text>

  <rect x="20" y="170" width="200" height="44" rx="6" fill="none" stroke="currentColor" opacity="0.85" />
  <text x="120" y="197" text-anchor="middle" font-size="13" fill="currentColor">광학 측정</text>

  <line x1="220" y1="132" x2="286" y2="150" stroke="currentColor" marker-end="url(#lt-a)" />
  <line x1="220" y1="192" x2="286" y2="174" stroke="currentColor" marker-end="url(#lt-a)" />

  <rect x="290" y="128" width="150" height="68" rx="6" fill="none" stroke="currentColor" />
  <text x="365" y="159" text-anchor="middle" font-size="13" fill="currentColor">등급 판정</text>
  <text x="365" y="177" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.7">분류 기준 적용</text>

  <line x1="440" y1="148" x2="496" y2="126" stroke="currentColor" marker-end="url(#lt-a)" />
  <text x="470" y="112" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.7">등급 정보</text>
  <rect x="500" y="94" width="160" height="44" rx="6" fill="none" stroke="currentColor" opacity="0.65" />
  <text x="580" y="121" text-anchor="middle" font-size="13" fill="currentColor">분류 장비</text>

  <line x1="440" y1="176" x2="496" y2="198" stroke="currentColor" marker-end="url(#lt-a)" />
  <text x="470" y="214" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.7">측정 결과</text>
  <rect x="500" y="186" width="160" height="44" rx="6" fill="none" stroke="currentColor" opacity="0.65" />
  <text x="580" y="213" text-anchor="middle" font-size="13" fill="currentColor">MES</text>
</svg>
<figcaption>
기종마다 측정 항목과 채널 수가 달랐습니다. 강조된 설정 단계를 사용자에게 열어둔 덕에
기종이 늘어날 때마다 코드를 새로 짜지 않아도 됐습니다.
</figcaption>
</figure>

## 맡은 일

**측정값 표시 UI 개발.** DC·AC 전기 측정값과 광학 측정값을 함께 보여주는 화면을
개발했습니다. 기종마다 측정 항목과 채널 수가 달라, 항목을 사용자가 직접 설정할 수
있게 만들어 기종이 늘어날 때마다 코드를 새로 짜지 않아도 되게 했습니다.

**상위 보고 프로그램 개발.** 측정 결과를 상위 시스템(MES)으로 올려보내는 인터페이스를
개발했습니다.

## 사용 기술

Visual C++ (Visual Studio), MES
