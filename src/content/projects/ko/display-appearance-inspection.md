---
title: "AOT 디스플레이 외관 검사 장비"
description: "휴대폰용 LCD 모듈의 상·하면 외관을 검사하는 장비. 장비 시퀀스와 운영 UI, 상·하위 장비 인터페이스, MES를 담당했습니다."
date: 2014-07-01
stack: ["Visual C++", "MFC", "MES", "CIM"]
featured: false
draft: false
---

휴대폰용 LCD 모듈의 외관을 검사하는 장비입니다. 상면과 하면을 각각 검사하는 구성으로
개발했고, 이후 1인치부터 8인치까지 다양한 크기의 모듈을 다루는 기종으로 확장했습니다.

<figure>
<svg viewBox="0 0 640 290" role="img" aria-label="인라인으로 연결된 앞뒤 공정 장비와 검사 시퀀스가 양방향 핸드셰이크로 상태를 주고받는다. 검사 시퀀스는 모듈의 상면과 하면을 각각 검사하고, 결과를 MES로 보고한다">
  <defs>
    <marker id="ao-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
    </marker>
  </defs>

  <rect x="20" y="100" width="120" height="76" rx="6" fill="none" stroke="currentColor" opacity="0.65" />
  <text x="80" y="132" text-anchor="middle" font-size="13" fill="currentColor">앞뒤 공정</text>
  <text x="80" y="150" text-anchor="middle" font-size="13" fill="currentColor">장비</text>

  <line x1="140" y1="138" x2="196" y2="138" stroke="currentColor" marker-start="url(#ao-a)" marker-end="url(#ao-a)" />
  <text x="168" y="126" text-anchor="middle" font-size="11" style="fill:var(--accent)">핸드셰이크</text>

  <rect x="200" y="100" width="140" height="76" rx="6" fill="none" style="stroke:var(--accent)" stroke-width="2" />
  <text x="270" y="132" text-anchor="middle" font-size="13" style="fill:var(--accent)">검사 시퀀스</text>
  <text x="270" y="150" text-anchor="middle" font-size="11" style="fill:var(--accent)">반송 · 정렬 · 촬상</text>

  <line x1="340" y1="122" x2="396" y2="86" stroke="currentColor" marker-end="url(#ao-a)" />
  <rect x="400" y="60" width="160" height="44" rx="6" fill="none" stroke="currentColor" opacity="0.8" />
  <text x="480" y="87" text-anchor="middle" font-size="13" fill="currentColor">상면 외관 검사</text>

  <line x1="340" y1="154" x2="396" y2="190" stroke="currentColor" marker-end="url(#ao-a)" />
  <rect x="400" y="168" width="160" height="44" rx="6" fill="none" stroke="currentColor" opacity="0.8" />
  <text x="480" y="195" text-anchor="middle" font-size="13" fill="currentColor">하면 외관 검사</text>

  <line x1="270" y1="176" x2="270" y2="222" stroke="currentColor" marker-end="url(#ao-a)" />
  <text x="282" y="204" font-size="12" fill="currentColor" opacity="0.7">결과 보고</text>

  <rect x="200" y="228" width="140" height="44" rx="6" fill="none" stroke="currentColor" opacity="0.65" />
  <text x="270" y="255" text-anchor="middle" font-size="13" fill="currentColor">MES</text>
</svg>
<figcaption>
인라인 장비는 한 대가 멈추면 라인 전체가 멈춥니다. 강조된 핸드셰이크가 앞뒤 장비의
상태를 정확히 읽고 넘겨주는 부분입니다.
</figcaption>
</figure>

## 맡은 일

**장비 제어 시퀀스 및 UI 프로그램 개발.** 반송·정렬·촬상·판정으로 이어지는 검사 흐름을
제어하고, 작업자가 장비를 운영하는 화면을 개발했습니다.

**상 · 하위 장비 인터페이스 개발.** 인라인으로 연결된 앞뒤 공정 장비와 신호를 주고받는
부분을 개발했습니다.

**MES 개발.** 검사 결과와 설비 상태를 상위 시스템에 보고하는 인터페이스를 개발했습니다.

## 사용 기술

Visual C++ (Visual Studio), MES / CIM
