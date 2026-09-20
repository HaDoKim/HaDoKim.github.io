---
title: "로봇 ESC 척 브러쉬 세정 장비"
description: "6축 로봇으로 반도체 ESC 척을 브러쉬 세정하는 장비의 제어 프로그램. 로봇·브러쉬 스핀들·DIO를 한 앱에서 제어하며, 2026년 9월 출하 준비 중입니다."
date: 2026-09-20
stack: ["C#", ".NET Framework 4.8", "WPF", "STEP Robot SDK", "Modbus RTU", "FASTECH DIO", "SQLite", "xUnit"]
featured: true
draft: false
---

반도체 공정에 쓰이는 ESC(정전 척)를 브러쉬로 닦는 장비입니다. 작업자가 레시피를 고르고
시작을 누르면 브러쉬 스핀들을 돌리고, 6축 로봇이 척 위를 지그재그·원·스파이럴 패턴으로
훑은 뒤 안전 위치로 물러납니다. 17인치 터치 패널에서 운전합니다.

로봇(TCP, 벤더 SDK), 브러쉬 드라이브(RS-485 Modbus RTU), 디지털 입출력(EtherNet)을
한 앱에서 다룹니다. 설계·구현·문서·안전성 검토까지 맡았고 **2026년 9월 출하 준비 중**입니다.

![가동 중인 메인 화면. 척 도면 위에 브러쉬가 지나간 궤적이 실시간으로 그려지고, 아래에 로봇 월드 좌표와 관절 각도, 하단에 로봇·브러쉬·DIO 연결 상태가 표시된다](/images/projects/esc-brushing-main.jpg)

## 구조

<figure>
<svg viewBox="0 0 680 320" role="img" aria-label="앱은 레시피 값을 로봇 컨트롤러의 프로그램 변수로 써 넣고 실행만 시킨다. 세정 궤적은 컨트롤러 안의 로봇 프로그램이 그린다. 브러쉬 스핀들과 DIO는 각각 드라이버를 거쳐 제어하고, 세정 도메인은 이 셋을 인터페이스로만 본다">
  <defs>
    <marker id="eb-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
    </marker>
  </defs>

  <rect x="20" y="110" width="150" height="70" rx="6" fill="none" stroke="currentColor" />
  <text x="95" y="139" text-anchor="middle" font-size="13" fill="currentColor">WPF 앱</text>
  <text x="95" y="157" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.7">운전 · 레시피 · 이력</text>

  <line x1="170" y1="145" x2="216" y2="145" stroke="currentColor" marker-end="url(#eb-a)" />

  <rect x="220" y="100" width="170" height="90" rx="6" fill="none" stroke="currentColor" opacity="0.9" />
  <text x="305" y="126" text-anchor="middle" font-size="13" fill="currentColor">세정 도메인</text>
  <text x="305" y="146" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.7">세정 사이클 · 레시피 검증</text>
  <text x="305" y="166" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.7">인터페이스만 의존</text>

  <line x1="390" y1="118" x2="446" y2="60" stroke="currentColor" marker-end="url(#eb-a)" />
  <text x="404" y="78" font-size="11" style="fill:var(--accent)">변수 기록 · 실행</text>
  <rect x="450" y="24" width="210" height="72" rx="6" fill="none" style="stroke:var(--accent)" stroke-width="2" />
  <text x="555" y="48" text-anchor="middle" font-size="13" style="fill:var(--accent)">로봇 컨트롤러</text>
  <text x="555" y="66" text-anchor="middle" font-size="11" style="fill:var(--accent)">궤적은 여기서 그린다</text>
  <text x="555" y="84" text-anchor="middle" font-size="11" style="fill:var(--accent)">지그재그 · 원 · 스파이럴</text>

  <line x1="390" y1="145" x2="446" y2="145" stroke="currentColor" marker-end="url(#eb-a)" />
  <rect x="450" y="122" width="210" height="46" rx="6" fill="none" stroke="currentColor" opacity="0.85" />
  <text x="555" y="142" text-anchor="middle" font-size="13" fill="currentColor">브러쉬 드라이브</text>
  <text x="555" y="159" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.7">BLDC · Modbus RTU</text>

  <line x1="390" y1="172" x2="446" y2="216" stroke="currentColor" marker-end="url(#eb-a)" />
  <rect x="450" y="194" width="210" height="46" rx="6" fill="none" stroke="currentColor" opacity="0.85" />
  <text x="555" y="214" text-anchor="middle" font-size="13" fill="currentColor">디지털 입출력</text>
  <text x="555" y="231" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.7">도어 · 센서 · EtherNet</text>

  <line x1="95" y1="256" x2="95" y2="186" stroke="currentColor" marker-end="url(#eb-a)" />
  <text x="106" y="226" font-size="11" fill="currentColor" opacity="0.7">이력 · 레시피</text>
  <rect x="20" y="262" width="150" height="44" rx="6" fill="none" stroke="currentColor" opacity="0.65" />
  <text x="95" y="289" text-anchor="middle" font-size="13" fill="currentColor">SQLite</text>
</svg>
<figcaption>
앱은 로봇을 점 단위로 움직이지 않습니다. 강조된 컨트롤러 안의 로봇 프로그램이 궤적을 그리고,
앱은 레시피 값을 프로그램 변수로 써 넣은 뒤 실행만 시킵니다.
</figcaption>
</figure>

## 설계에서 신경 쓴 것

**궤적은 로봇이 그리고, 앱은 값만 씁니다.** PC에서 로봇을 점 단위로 실시간 제어하면 통신
지연이 곧 궤적 오차가 됩니다. 그래서 지그재그·원·스파이럴 궤적을 로봇 컨트롤러에서 도는
프로그램으로 만들고, 앱은 레시피의 속도·간격·회전 수를 프로그램 변수로 써 넣은 뒤 실행만
시킵니다. 대가는 컨트롤러 언어의 제약을 그대로 떠안는 것입니다 — **이 언어에는 나눗셈이
없어서** 반복 횟수는 앱이 미리 계산해 넣고, 변수 파일 줄 끝이 CRLF면 조용히 무시되며,
매뉴얼에 있는 명령이 펌웨어엔 없기도 합니다. 실물로 확인한 제약을 전부 문서로 남겼습니다.

**하드웨어 없이 757개 테스트.** 세정 도메인은 로봇·브러쉬·저장소를 인터페이스로만 봅니다.
그래서 세정 사이클의 순서, 레시피 검증, 이력 기록을 로봇 없이 단위 테스트로 검증합니다.
빌드는 경고 하나도 허용하지 않습니다(`TreatWarningsAsErrors`).

**안전.** 세정이 끝나면 레시피에 저장된 안전 위치로 물러나되 그동안만 속도를 낮춥니다.
세정 중에는 수동 이동을 잠급니다. 권한은 작업자·엔지니어·개발자 세 등급으로 PIN으로
올라갑니다. 출하 전 소프트웨어가 맡는 안전의 몫을 따로 분석해, 남은 구멍과 조치를
우선순위별로 정리한 검토 문서를 만들었습니다.

**알람은 코드로.** 로봇·브러쉬·DIO의 알람을 하나의 코드 사전으로 모으고, 발생과 해제를
쌍으로 기록합니다. 로봇 프로그램을 실물에 맞춰 가는 동안 이 이력이 디버깅의 주 도구였습니다.

![알람 이력 화면. 시각·코드·사건·종류 열로 정리된 목록에 로봇과 브러쉬 드라이브의 알람이 발생·해제 쌍으로 기록되어 있다](/images/projects/esc-brushing-alarms.jpg)

**벤더 SDK가 정하는 제약.** 로봇 SDK가 혼합 모드 C++/CLI라 .NET Framework 4.8과 x64가
강제됩니다. 이 제약을 `Directory.Build.props` 한 곳에 걸어 모든 프로젝트가 같은 조건으로
빌드되게 했습니다.

## 사용 기술

C# / .NET Framework 4.8 (x64), WPF (MVVM), MahApps.Metro, STEP 로봇 SDK, NModbus
(Modbus RTU), FASTECH Ezi-IO, SQLite, FluentFTP, xUnit

로봇 프로그램은 `zigzag_ov` 하나에 네 가지 세정 동작을 담았고, 생성 스크립트와 미니
해석기를 함께 둬서 앱 없이도 프로그램을 검증할 수 있게 했습니다. 소스는 납품 계약상
공개하지 않습니다.
