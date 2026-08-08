---
title: "이차전지 성능 검사 장비"
description: "항목별 성능을 계측해 양불을 판정하는 장비. 계측기 인터페이스, PLC 라이브러리, 장비 상태·이력 모니터링을 담당했습니다."
date: 2021-10-01
stack: ["Visual C++", "MFC", "MariaDB", "RS232", "TCP/IP", "PLC"]
featured: true
draft: false
---

이차전지의 성능을 항목별로 계측하고, 그 결과로 양불을 판정하는 검사 장비입니다.

<figure>
<svg viewBox="0 0 680 330" role="img" aria-label="검사 항목별 계측기들이 RS232와 TCP/IP로 서로 다르게 붙어 있고, 계측기 인터페이스 계층이 그 차이를 흡수해 호스트에 같은 형태로 전달한다. 호스트는 판정 결과와 함께 원시 계측값을 MariaDB에 남기고, 그 기록을 이력 조회 화면에서 되짚을 수 있다">
  <defs>
    <marker id="pf-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
    </marker>
  </defs>

  <rect x="30" y="16" width="110" height="48" rx="6" fill="none" stroke="currentColor" opacity="0.65" />
  <text x="85" y="37" text-anchor="middle" font-size="13" fill="currentColor">계측기 A</text>
  <text x="85" y="54" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.6">RS232</text>

  <rect x="160" y="16" width="110" height="48" rx="6" fill="none" stroke="currentColor" opacity="0.65" />
  <text x="215" y="37" text-anchor="middle" font-size="13" fill="currentColor">계측기 B</text>
  <text x="215" y="54" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.6">TCP/IP</text>

  <rect x="290" y="16" width="110" height="48" rx="6" fill="none" stroke="currentColor" opacity="0.65" />
  <text x="345" y="37" text-anchor="middle" font-size="13" fill="currentColor">계측기 C</text>
  <text x="345" y="54" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.6">RS232</text>

  <line x1="85" y1="64" x2="85" y2="92" stroke="currentColor" marker-end="url(#pf-a)" />
  <line x1="215" y1="64" x2="215" y2="92" stroke="currentColor" marker-end="url(#pf-a)" />
  <line x1="345" y1="64" x2="345" y2="92" stroke="currentColor" marker-end="url(#pf-a)" />

  <rect x="30" y="98" width="370" height="44" rx="6" fill="none" stroke="currentColor" opacity="0.9" />
  <text x="215" y="125" text-anchor="middle" font-size="13" fill="currentColor">계측기 인터페이스 계층</text>

  <line x1="215" y1="142" x2="215" y2="172" stroke="currentColor" marker-end="url(#pf-a)" />

  <rect x="30" y="178" width="370" height="52" rx="6" fill="none" stroke="currentColor" />
  <text x="215" y="209" text-anchor="middle" font-size="13" fill="currentColor">호스트 프로그램 — 판정</text>

  <line x1="400" y1="204" x2="462" y2="204" stroke="currentColor" marker-end="url(#pf-a)" />
  <text x="431" y="194" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.7">기록</text>

  <rect x="470" y="178" width="180" height="52" rx="6" fill="none" style="stroke:var(--accent)" stroke-width="2" />
  <text x="560" y="199" text-anchor="middle" font-size="13" style="fill:var(--accent)">MariaDB</text>
  <text x="560" y="216" text-anchor="middle" font-size="11" style="fill:var(--accent)">원시 계측값 · 장비 상태</text>

  <line x1="560" y1="230" x2="560" y2="266" stroke="currentColor" marker-end="url(#pf-a)" />
  <text x="570" y="252" font-size="12" fill="currentColor" opacity="0.7">사후 추적</text>

  <rect x="470" y="272" width="180" height="44" rx="6" fill="none" stroke="currentColor" opacity="0.65" />
  <text x="560" y="299" text-anchor="middle" font-size="13" fill="currentColor">이력 조회 화면</text>
</svg>
<figcaption>
검사 장비는 판정만 내고 끝나지 않습니다. 강조된 저장 경로가 "이 셀이 왜 불량으로
나왔는지"를 나중에 되짚을 수 있게 하는 부분입니다.
</figcaption>
</figure>

## 맡은 일

**계측기 인터페이스 개발.** 검사 항목마다 다른 계측기가 붙었고 통신 방식도 RS232와
TCP/IP로 갈렸습니다. 계측기별 통신 코드를 각각 개발하되 상위에서는 같은 방식으로
다루도록 정리했습니다.

**PLC 인터페이스 라이브러리 개발.** 장비 구동부와의 신호 처리를 라이브러리로 분리해,
장비마다 다시 만들지 않고 재사용할 수 있게 했습니다.

**항목별 데이터 표시 UI 개발.** 검사 항목별 계측값을 조회하는 화면을 개발했습니다.

**장비 상태 · 이력 모니터링 프로그램 개발.** 항목별 원시 계측값과 장비 상태를 함께
남겨, 사후에 추적이 가능하도록 만들었습니다.

## 사용 기술

Visual C++ / MFC, MariaDB, RS232 · TCP/IP 통신, PLC 인터페이스
