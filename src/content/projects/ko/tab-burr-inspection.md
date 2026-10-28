---
title: "탭 버(Burr) 비전 검사 장비"
description: "트레이에 담긴 탭 부품의 버를 비전으로 검사하고 불량을 골라내는 장비. 시퀀스·화면·장비 통신을 포함한 제어 프로그램 전체를 개발했고, 출하되어 가동 중입니다."
date: 2026-02-11
stack: ["C#", ".NET Framework 4.7.2", "WPF", "MVVM", "AJINEXTEK AXL", "TCP/IP", "NLog"]
featured: false
draft: false
---

트레이 단위로 들어오는 탭 부품의 버(Burr)를 비전으로 검사하는 장비입니다. 투입 컨베이어로
들어온 트레이를 셔틀이 비전 아래로 옮기고, 트레이의 포켓을 하나씩 촬상해 판정한 뒤 배출
컨베이어로 내보냅니다. 불량이 나온 포켓은 NG 피커가 집어 불량 컨베이어로 따로 뺍니다.

제어 프로그램 전체를 개발했습니다. 장비 시퀀스, 운영 화면, 레시피와 티칭, 비전·바코드 통신,
알람과 이력까지 맡았고, 출하되어 현장에서 가동 중입니다.

<figure>
<svg viewBox="0 0 680 300" role="img" aria-label="트레이가 투입 컨베이어에서 바코드로 트레이 ID를 읽힌 뒤 셔틀로 넘어간다. 셔틀이 비전 아래로 이동하면 비전이 포켓마다 두 번 촬상해 판정한다. 검사가 끝난 트레이는 배출 컨베이어로 나가고, 불량 포켓은 NG 피커가 불량 컨베이어로 옮긴다">
  <defs>
    <marker id="tb-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
    </marker>
  </defs>
  <rect x="20" y="30" width="120" height="44" rx="6" fill="none" stroke="currentColor" opacity="0.65" />
  <text x="80" y="57" text-anchor="middle" font-size="13" fill="currentColor">바코드</text>
  <line x1="80" y1="74" x2="80" y2="124" stroke="currentColor" marker-end="url(#tb-a)" />
  <text x="90" y="104" font-size="11" fill="currentColor" opacity="0.7">트레이 ID</text>
  <rect x="20" y="130" width="120" height="56" rx="6" fill="none" stroke="currentColor" opacity="0.85" />
  <text x="80" y="155" text-anchor="middle" font-size="13" fill="currentColor">투입 컨베이어</text>
  <text x="80" y="173" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.7">트레이 3자리</text>
  <line x1="140" y1="158" x2="176" y2="158" stroke="currentColor" marker-end="url(#tb-a)" />
  <rect x="180" y="20" width="160" height="56" rx="6" fill="none" style="stroke:var(--accent)" stroke-width="2" />
  <text x="260" y="44" text-anchor="middle" font-size="13" style="fill:var(--accent)">비전 (Y · Z)</text>
  <text x="260" y="62" text-anchor="middle" font-size="11" style="fill:var(--accent)">포켓마다 2회 촬상</text>
  <line x1="260" y1="76" x2="260" y2="124" style="stroke:var(--accent)" marker-end="url(#tb-a)" />
  <text x="270" y="104" font-size="11" style="fill:var(--accent)">둘 다 합격 = 양품</text>
  <rect x="180" y="130" width="160" height="56" rx="6" fill="none" stroke="currentColor" />
  <text x="260" y="155" text-anchor="middle" font-size="13" fill="currentColor">셔틀 (X)</text>
  <text x="260" y="173" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.7">투입 → 검사 → 배출 위치</text>
  <line x1="340" y1="158" x2="376" y2="158" stroke="currentColor" marker-end="url(#tb-a)" />
  <rect x="380" y="130" width="130" height="56" rx="6" fill="none" stroke="currentColor" opacity="0.85" />
  <text x="445" y="155" text-anchor="middle" font-size="13" fill="currentColor">배출 컨베이어</text>
  <text x="445" y="173" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.7">트레이 4자리</text>
  <line x1="510" y1="158" x2="546" y2="158" stroke="currentColor" marker-end="url(#tb-a)" />
  <rect x="550" y="130" width="110" height="56" rx="6" fill="none" stroke="currentColor" opacity="0.85" />
  <text x="605" y="155" text-anchor="middle" font-size="13" fill="currentColor">NG 피커</text>
  <text x="605" y="173" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.7">불량 포켓만</text>
  <line x1="605" y1="186" x2="605" y2="236" stroke="currentColor" marker-end="url(#tb-a)" />
  <rect x="550" y="242" width="110" height="44" rx="6" fill="none" stroke="currentColor" opacity="0.65" />
  <text x="605" y="269" text-anchor="middle" font-size="13" fill="currentColor">불량 컨베이어</text>
  <line x1="445" y1="186" x2="445" y2="236" stroke="currentColor" marker-end="url(#tb-a)" />
  <text x="445" y="256" text-anchor="middle" font-size="12" fill="currentColor" opacity="0.7">양품 트레이 배출</text>
</svg>
<figcaption>
판정은 강조된 비전 쪽에서 내립니다. 포켓마다 두 번 촬상해 둘 다 합격일 때만 양품으로 보고,
그 결과가 트레이 전체 판정의 기준이 됩니다.
</figcaption>
</figure>

## 설계에서 신경 쓴 것

**구역마다 독립된 시퀀스.** 투입 트레이, 투입 컨베이어, 셔틀·비전, 배출 컨베이어, NG 피커,
불량 컨베이어를 각각 별도 스레드의 시퀀스로 나눴습니다. 공통 기반 클래스에 택트·지연·타임아웃
타이머와 초기화 동작을 두고, 각 시퀀스는 자기 구역의 순서만 책임집니다. 구역끼리는 트레이
정보를 주고받으며 맞물려 돕니다.

**검사 시간 줄이기.** 한 포켓을 두 번 촬상하도록 바꾸면서 검사 시간이 늘어나는 문제가 생겼습니다.
셔틀 X축과 비전 Y축을 동시에 움직이도록 시퀀스를 고쳐, 다음 촬상 위치로 가는 시간을 겹쳤습니다.
비전 모델을 바꾸는 동작도 비동기로 돌려 그동안 장비가 멈추지 않게 했습니다.

**막힘을 미리 막기.** 배출 컨베이어의 마지막 자리에 트레이가 남아 있으면 셔틀이 검사 영역으로
들어가지 않습니다. 검사를 마쳐도 내보낼 곳이 없으면 셔틀이 트레이를 든 채 갇히기 때문입니다.
정지 후 다시 시작할 때는 직전 동작을 한 번 더 확인하고 이어 가도록 했습니다.

**현장 운영.** 레시피마다 티칭 위치를 따로 갖고, 티칭 위치별로 속도와 가감속을 설정합니다.
트레이의 행·열 수를 바꾸면 검사 결과 화면도 그에 맞게 바뀝니다. 이력 화면에서 트레이 바코드로
검사 이미지를 다시 찾아볼 수 있고, 위치별 제품을 수동으로 지우는 기능은 장비가 정지했을 때만
쓸 수 있게 막았습니다. 작업자 권한, 한국어·영어·중국어 화면 전환, 시퀀스별 로그와 장비
택트 타임 기록, 오래된 파일 자동 정리를 넣었습니다.

## 사용 기술

C# / .NET Framework 4.7.2, WPF (MVVM, CommunityToolkit.Mvvm), AJINEXTEK AXL 모션·IO,
TCP/IP 소켓(비전·바코드), NLog
