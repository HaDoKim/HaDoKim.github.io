---
title: "유압 실린더 내구성 평가 시스템"
description: "챔버 온도를 제어하며 유압 실린더를 반복 구동해 내구성을 평가하는 설비의 제어·모니터링 소프트웨어. 설계부터 납품까지 단독 개발했고 현재 가동 중입니다."
date: 2026-09-16
stack: ["C#", ".NET 8", "WPF", "Modbus RTU", "FASTECH DIO", "xUnit"]
featured: true
draft: false
---

항온 챔버 안에서 유압 실린더를 전·후진 반복시키며 내구성을 평가하는 설비입니다.
온도 컨트롤러에 목표 온도를 쓰고, 목표 범위에 들어오면 실린더를 구동하며, 동작
횟수와 소요 시간·온도를 기록합니다. 온도는 Modbus RTU로, 실린더 밸브와 끝단 센서는
EtherNet DIO로 다룹니다.

설계, 구현, 문서, 납품까지 혼자 맡았고 **2026년 9월 현재 현장에서 가동 중**입니다.

![가동 중인 메인 화면. 왼쪽에 현재 온도와 설정값, 오른쪽에 실린더 상태와 전·후진 횟수, 아래에 온도 추이 곡선과 동작별 소요 시간 막대 차트가 있다](/images/projects/monitoring-app-main.jpg)

## 구조

<figure>
<svg viewBox="0 0 680 300" role="img" aria-label="WPF 앱은 Monitoring.Core의 인터페이스 두 개만 알고 있다. 그 뒤에 Modbus 온도 컨트롤러 구현, FASTECH DIO 구현, 시뮬레이션 구현이 갈아끼워진다. 터치용 가상 키보드는 앱과 독립된 라이브러리다">
  <defs>
    <marker id="ma-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
    </marker>
  </defs>

  <rect x="20" y="96" width="150" height="70" rx="6" fill="none" stroke="currentColor" />
  <text x="95" y="124" text-anchor="middle" font-size="13" fill="currentColor">MonitoringApp</text>
  <text x="95" y="143" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.7">WPF · MVVM</text>

  <line x1="170" y1="131" x2="216" y2="131" stroke="currentColor" marker-end="url(#ma-a)" />

  <rect x="220" y="86" width="180" height="90" rx="6" fill="none" style="stroke:var(--accent)" stroke-width="2" />
  <text x="310" y="110" text-anchor="middle" font-size="13" style="fill:var(--accent)">Monitoring.Core</text>
  <text x="310" y="132" text-anchor="middle" font-size="11" style="fill:var(--accent)">ITemperatureController</text>
  <text x="310" y="150" text-anchor="middle" font-size="11" style="fill:var(--accent)">IDioModule</text>

  <line x1="400" y1="110" x2="446" y2="62" stroke="currentColor" marker-end="url(#ma-a)" />
  <rect x="450" y="36" width="210" height="48" rx="6" fill="none" stroke="currentColor" opacity="0.85" />
  <text x="555" y="56" text-anchor="middle" font-size="13" fill="currentColor">ModbusRtuService</text>
  <text x="555" y="73" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.7">온도 컨트롤러 · 시리얼</text>

  <line x1="400" y1="131" x2="446" y2="131" stroke="currentColor" marker-end="url(#ma-a)" />
  <rect x="450" y="107" width="210" height="48" rx="6" fill="none" stroke="currentColor" opacity="0.85" />
  <text x="555" y="127" text-anchor="middle" font-size="13" fill="currentColor">FastechDioService</text>
  <text x="555" y="144" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.7">밸브 · 센서 · EtherNet</text>

  <line x1="400" y1="152" x2="446" y2="200" stroke="currentColor" stroke-dasharray="4 3" marker-end="url(#ma-a)" />
  <rect x="450" y="178" width="210" height="48" rx="6" fill="none" stroke="currentColor" stroke-dasharray="4 3" opacity="0.7" />
  <text x="555" y="198" text-anchor="middle" font-size="13" fill="currentColor">시뮬레이션</text>
  <text x="555" y="215" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.7">장비 없을 때 자동 대체</text>

  <line x1="95" y1="212" x2="95" y2="172" stroke="currentColor" marker-end="url(#ma-a)" />
  <text x="106" y="196" font-size="11" fill="currentColor" opacity="0.7">터치 입력</text>
  <rect x="20" y="218" width="150" height="48" rx="6" fill="none" stroke="currentColor" opacity="0.65" />
  <text x="95" y="238" text-anchor="middle" font-size="13" fill="currentColor">VirtualKeyboard</text>
  <text x="95" y="255" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.7">앱과 독립된 라이브러리</text>
</svg>
<figcaption>
앱은 강조된 인터페이스 두 개만 압니다. 실물 장비와 시뮬레이션은 그 뒤에서 갈아끼워지므로,
장비 없이도 개발·테스트·시연이 가능하고 현장에서 통신이 끊겨도 앱은 멈추지 않습니다.
</figcaption>
</figure>

## 설계에서 신경 쓴 것

**장비 없이 돌아가는 구조.** 온도 컨트롤러와 DIO 모듈을 각각 인터페이스 뒤에 두고,
실물이 없거나 연결에 실패하면 시뮬레이션 구현으로 자동 대체합니다. 개발과 테스트를
사무실에서 할 수 있었고, 납품 전 시연도 장비 없이 했습니다. 통신을 담당하는
`Monitoring.Core`는 UI를 전혀 모르는 별도 프로젝트라 xUnit으로 따로 검증합니다.

**통신 두절을 알람으로 다룸.** 현장에서 가장 흔한 사고는 케이블이 빠지는 것입니다.
입출력이 연속 3회 실패하면 단선으로 판단해 전체 동작을 멈추고 알람을 띄우며, 그동안
입력값은 시뮬레이션이 아니라 **마지막 실측 상태를 유지**합니다. 재접속되면 알람은 스스로
풀립니다. 통신 실패는 시작부터 복구까지 하나의 에피소드로 묶어 로그에 남깁니다.

![챔버 알람 팝업. 알람 발생 시각과 함께 챔버 가동 출력을 내렸다는 안내, 설비 상태를 확인하고 알람을 해제한 뒤 다시 시작하라는 문구가 있다](/images/projects/monitoring-app-alarm.jpg)

**현장 운영에 필요한 것들.** 터치 패널에서 쓰는 장비라 마우스·키보드가 없습니다. 포커스를
빼앗지 않는 가상 키보드를 직접 만들었고, 두벌식 한글 조합까지 구현했습니다. 설정 화면은
비밀번호로 잠그고, 온도와 실린더 동작은 날짜별 CSV로 남기며, 로그 뷰어에서 바로 열어볼 수
있습니다. 실행 파일에 버전과 커밋 해시를 각인해 현장 문의 시 어떤 빌드인지 바로 확인합니다.

![로그 뷰어. 날짜별 온도 로그 CSV를 선택하면 온도 곡선과 시각·온도·실린더 상태 표가 함께 표시된다](/images/projects/monitoring-app-logviewer.jpg)

**과열 보호.** 목표 온도와 별개로 과열 상한을 두고, 한 번이라도 넘으면 즉시 정지합니다.
온도 범위를 벗어나면 실린더는 일시 정지하되 챔버는 유지하고, 상한을 넘으면 전부 내립니다.

## 사용 기술

C# / .NET 8, WPF (MVVM 직접 구현), MahApps.Metro, LiveCharts, NModbus (Modbus RTU),
FASTECH EziMOTIONPlusE (P/Invoke), xUnit

화면은 시뮬레이션 모드로 찍은 것입니다. 소스는 납품 계약상 공개하지 않습니다.
