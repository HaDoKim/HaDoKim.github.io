---
title: "메모리 반도체 Test Handler"
description: "메모리 반도체를 고온·저온 상태에서 성능 검사하는 장비. 장비 전장 설계를 담당했습니다."
date: 2006-07-01
stack: ["P-CAD", "PLC"]
featured: false
draft: false
---

메모리 반도체를 고온(HOT)과 저온(COLD) 상태에서 성능 검사하기 위한 장비입니다.
상온에서는 정상인 소재가 온도 조건에서 달라지기 때문에, 챔버 안에서 온도를 유지한 채
테스트하는 구성이 필요했습니다.

경력의 출발점이 된 프로젝트로, 소프트웨어가 아니라 하드웨어 쪽에서 시작했습니다.
전장을 직접 설계해 본 경험은 이후 장비 제어 소프트웨어를 만들 때 신호가 실제로 어떤
경로를 거쳐 오는지 이해하는 바탕이 됐습니다.

<figure>
<svg viewBox="0 0 680 250" role="img" aria-label="모션 파트, 입출력 파트, 전원 파트로 나눈 전장이 Handler를 구성한다. Handler는 챔버 안에서 고온과 저온 조건을 유지하며, Manipulator가 Handler와 Tester Head를 도킹시킨다">
  <defs>
    <marker id="mh-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
    </marker>
  </defs>

  <rect x="20" y="20" width="140" height="44" rx="6" fill="none" stroke="currentColor" opacity="0.85" />
  <text x="90" y="47" text-anchor="middle" font-size="13" fill="currentColor">Motion Part</text>

  <rect x="20" y="80" width="140" height="44" rx="6" fill="none" stroke="currentColor" opacity="0.85" />
  <text x="90" y="107" text-anchor="middle" font-size="13" fill="currentColor">I/O Part</text>

  <rect x="20" y="140" width="140" height="44" rx="6" fill="none" stroke="currentColor" opacity="0.85" />
  <text x="90" y="167" text-anchor="middle" font-size="13" fill="currentColor">Power Part</text>

  <line x1="160" y1="42" x2="204" y2="76" stroke="currentColor" marker-end="url(#mh-a)" />
  <line x1="160" y1="102" x2="204" y2="102" stroke="currentColor" marker-end="url(#mh-a)" />
  <line x1="160" y1="162" x2="204" y2="128" stroke="currentColor" marker-end="url(#mh-a)" />
  <text x="182" y="196" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.6">전장 설계</text>

  <rect x="208" y="58" width="140" height="88" rx="6" fill="none" stroke="currentColor" />
  <text x="278" y="92" text-anchor="middle" font-size="13" fill="currentColor">Handler</text>
  <text x="278" y="112" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.7">챔버</text>
  <text x="278" y="128" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.7">HOT / COLD</text>

  <line x1="348" y1="102" x2="392" y2="102" stroke="currentColor" marker-start="url(#mh-a)" marker-end="url(#mh-a)" />

  <rect x="396" y="74" width="130" height="56" rx="6" fill="none" style="stroke:var(--accent)" stroke-width="2" />
  <text x="461" y="98" text-anchor="middle" font-size="13" style="fill:var(--accent)">Manipulator</text>
  <text x="461" y="116" text-anchor="middle" font-size="11" style="fill:var(--accent)">PLC 제어</text>
  <text x="461" y="152" text-anchor="middle" font-size="11" style="fill:var(--accent)">도킹</text>

  <line x1="526" y1="102" x2="570" y2="102" stroke="currentColor" marker-start="url(#mh-a)" marker-end="url(#mh-a)" />

  <rect x="574" y="74" width="96" height="56" rx="6" fill="none" stroke="currentColor" opacity="0.65" />
  <text x="622" y="99" text-anchor="middle" font-size="13" fill="currentColor">Tester</text>
  <text x="622" y="116" text-anchor="middle" font-size="13" fill="currentColor">Head</text>
</svg>
<figcaption>
Handler와 Tester Head는 따로 놓인 장비입니다. 강조된 Manipulator가 둘을 물리적으로
맞물려 주고, 그 PLC 프로그램을 담당했습니다.
</figcaption>
</figure>

## 맡은 일

**장비 전장 설계.** Motion, I/O, Power 각 파트의 전장을 설계했습니다. 메모리 디바이스용
기종과 모듈(PC 메모리)용 기종을 개발했습니다.

**Manipulator PLC 프로그램 유지보수.** Handler와 Tester Head를 도킹시키는 장치의 PLC
프로그램을 담당했습니다.

## 사용 기술

P-CAD, PLC
