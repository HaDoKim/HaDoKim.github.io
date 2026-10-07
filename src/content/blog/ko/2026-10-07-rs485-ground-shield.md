---
title: "소프트웨어로는 유실률을 못 고친다"
description: "브러쉬 드라이브와의 RS-485 통신이 회전 중에만 16~21% 유실됐다. 계측으로 원인을 좁히고 소프트웨어로 손실을 줄였지만, 끝낸 건 GND 선 하나와 실드 케이블이었다."
date: 2026-10-07
tags: ["장비 제어", "RS-485", "Modbus"]
draft: false
---

로봇 세정 장비의 브러쉬는 BLDC 드라이브가 돌립니다. PC와는 RS-485 Modbus RTU로
연결되어 있고, 앱이 회전수와 방향을 쓰고 부하율을 읽습니다. 책상에서 시험할 때는 아무
문제가 없었습니다.

문제는 8시간 연속 시험에서 나왔습니다.

## 1.54초

원 세정은 시계 방향으로 돌다가 역방향으로 돌아옵니다. 그 사이에 앱이 브러쉬에 역회전
지령을 보내고, 반전이 끝날 때까지 기다렸다가 로봇이 다시 출발합니다.

그런데 어느 회차에서 역회전 지령 하나를 쓰는 데 **1.54초**가 걸렸습니다. 평소에는
0.02초입니다. 로봇은 정해진 대기 시간이 지나자 출발했고, 브러쉬는 아직 반전 중이었습니다.
척 위에서 브러쉬가 거꾸로 도는 채로 로봇이 반대 방향으로 움직인 겁니다.

## 느린 게 어디서 느린가

처음 의심한 건 제 코드였습니다. 앱은 회전 중에 부하율을 주기적으로 읽는데, 지령 쓰기와
상태 읽기가 같은 직렬 포트를 씁니다. 읽기가 포트를 붙잡고 있는 동안 지령이 기다린 게
아닐까.

그래서 느린 요청마다 시간을 둘로 나눠 남기게 했습니다. **포트를 얻기까지 기다린 시간**과
**실제로 주고받은 시간**. 앞쪽이 길면 제 코드의 순서 문제고, 뒤쪽이 길면 통신 자체의
문제입니다.

첫 로그가 바로 다른 문제를 드러냈습니다. 지연 경고가 **시간당 1,700줄**이 쌓여 8시간
시험 로그를 덮어 버렸습니다. 건마다 남기는 대신 10분마다 한 줄로 요약하게 바꿨습니다 —
요청 수, 지연 비율, 실패 수, 평균과 최대. 지령 지연과 실패, 1초가 넘는 읽기만 따로 한 줄씩
남깁니다.

요약이 보여준 그림은 분명했습니다. 기다림이 아니라 **응답이 아예 오지 않는** 요청들이었고,
그 비율이 **16~21%**였습니다. 그리고 그건 **브러쉬가 돌고 있을 때만**이었습니다.

## 손실은 줄일 수 있다

응답이 안 오면 앱은 기다렸다가 다시 보냅니다. 그때 설정은 응답 대기 500ms에 재전송 대기
250ms. 유실 한 번마다 0.8초를 물고 있었고, 그게 반전 지연을 최대 4.1초까지 밀었습니다.

정상 응답은 실측으로 40ms, 가장 느린 것도 58ms였습니다. 응답 대기를 150ms로 줄여도 세 배
여유가 있습니다. 재전송 대기는 20ms로 줄였습니다. 유실 한 번의 손실이 **790ms에서 190ms**가
됐습니다.

브러쉬 반전 대기도 늘렸습니다. 통신이 흔들리는 동안 반전 완료가 1.06초에서 1.95초 사이로
흔들렸고, 30회를 다시 재 보니 최대 2.31초까지 나왔습니다. 대기 시간을 1.5초에서 2.5초로
올렸습니다.

그 커밋에 이렇게 적었습니다.

> 유실률 자체는 배선 문제라 그대로다 — 손실만 줄인다.

여기까지가 소프트웨어가 할 수 있는 일이었습니다. 장비는 돌아가게 됐지만, 다섯 번 중 한
번꼴로 말이 전달되지 않는 상태는 그대로였습니다.

## 회전 중에만

"브러쉬가 돌 때만"이라는 조건이 원인을 가리키고 있었습니다. 모터가 돌면 드라이브가
전력을 고속으로 스위칭하고, 그 잡음이 주변 배선과 접지로 퍼집니다. 정지 중에는 없는
잡음입니다.

<figure>
<svg viewBox="0 0 680 300" role="img" aria-label="작업 전에는 PC 쪽 RS-485 변환기와 브러쉬 드라이브 사이에 A선과 B선 두 가닥만 실드 없이 연결되어 있어, 모터가 돌 때 양쪽 GND 전위가 따로 흔들렸다. 작업 후에는 A, B에 더해 신호 GND 선을 연결하고 세 선을 실드 케이블로 감싸 기준 전위를 공유하고 외부 잡음을 막았다">
  <defs>
    <marker id="rs-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
    </marker>
  </defs>
  <text x="20" y="28" font-size="13" fill="currentColor" opacity="0.7">작업 전</text>
  <rect x="20" y="44" width="130" height="88" rx="6" fill="none" stroke="currentColor" />
  <text x="85" y="72" text-anchor="middle" font-size="13" fill="currentColor">PC 변환기</text>
  <text x="85" y="94" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.7">A · B</text>
  <text x="85" y="118" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.6">GND ①</text>
  <line x1="150" y1="78" x2="380" y2="78" stroke="currentColor" />
  <line x1="150" y1="96" x2="380" y2="96" stroke="currentColor" />
  <text x="265" y="70" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.7">A · B 두 가닥, 실드 없음</text>
  <rect x="380" y="44" width="130" height="88" rx="6" fill="none" stroke="currentColor" />
  <text x="445" y="72" text-anchor="middle" font-size="13" fill="currentColor">브러쉬 드라이브</text>
  <text x="445" y="94" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.7">A · B</text>
  <text x="445" y="118" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.6">GND ②</text>
  <path d="M 540 60 q 10 -10 20 0 t 20 0 t 20 0 t 20 0" fill="none" stroke="currentColor" opacity="0.6" />
  <path d="M 540 78 q 10 -10 20 0 t 20 0 t 20 0 t 20 0" fill="none" stroke="currentColor" opacity="0.6" />
  <text x="580" y="104" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.7">모터 회전 시</text>
  <text x="580" y="120" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.7">스위칭 잡음</text>
  <text x="265" y="124" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.7">GND ① ≠ GND ②</text>
  <text x="20" y="176" font-size="13" style="fill:var(--accent)">작업 후</text>
  <rect x="20" y="192" width="130" height="88" rx="6" fill="none" stroke="currentColor" />
  <text x="85" y="220" text-anchor="middle" font-size="13" fill="currentColor">PC 변환기</text>
  <text x="85" y="242" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.7">A · B</text>
  <text x="85" y="266" text-anchor="middle" font-size="11" style="fill:var(--accent)">SG</text>
  <rect x="150" y="212" width="230" height="58" rx="10" fill="none" style="stroke:var(--accent)" stroke-width="2" stroke-dasharray="5 3" />
  <text x="265" y="206" text-anchor="middle" font-size="11" style="fill:var(--accent)">실드 케이블</text>
  <line x1="150" y1="226" x2="380" y2="226" stroke="currentColor" />
  <line x1="150" y1="244" x2="380" y2="244" stroke="currentColor" />
  <line x1="150" y1="262" x2="380" y2="262" style="stroke:var(--accent)" stroke-width="2" />
  <text x="265" y="256" text-anchor="middle" font-size="11" style="fill:var(--accent)">신호 GND 추가</text>
  <rect x="380" y="192" width="130" height="88" rx="6" fill="none" stroke="currentColor" />
  <text x="445" y="220" text-anchor="middle" font-size="13" fill="currentColor">브러쉬 드라이브</text>
  <text x="445" y="242" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.7">A · B</text>
  <text x="445" y="266" text-anchor="middle" font-size="11" style="fill:var(--accent)">SG</text>
  <text x="590" y="232" text-anchor="middle" font-size="13" style="fill:var(--accent)">유실</text>
  <text x="590" y="254" text-anchor="middle" font-size="13" style="fill:var(--accent)">16~21% → 0%</text>
</svg>
<figcaption>
바꾼 것은 강조된 두 가지입니다. 양쪽이 같은 기준 전위를 쓰도록 신호 GND 선을 잇고, 세
가닥을 실드 케이블로 감쌌습니다.
</figcaption>
</figure>

RS-485는 두 선(A, B)의 **전압 차이**로 신호를 읽는 차동 방식이라 잡음에 강하다고 알려져
있습니다. 그래서 A, B 두 가닥만 잇는 배선이 흔합니다. 하지만 수신기가 차이를 제대로 읽으려면
두 선의 전압이 수신기 기준으로 **허용 범위 안**에 있어야 합니다. PC 쪽 변환기와 드라이브가
기준(GND)을 공유하지 않으면, 모터가 돌 때 드라이브 쪽 기준이 흔들리면서 그 범위를 벗어나는
순간이 생깁니다. 그 순간의 프레임이 깨집니다. 정지 중에는 흔들릴 이유가 없으니 멀쩡했던
겁니다.

그래서 두 가지를 바꿨습니다.

- **신호 GND(SG) 선을 추가**해 PC 변환기와 드라이브가 같은 기준 전위를 쓰게 했습니다.
- 통신선을 **실드 케이블로 교체**해 모터 쪽 잡음이 선에 실리는 것을 막았습니다.

결과는 **유실 0%**. 회전 중에도 실패와 지연이 사라졌습니다.

## 남은 일

이제 소프트웨어로 덧댄 것들을 되돌릴 차례입니다. 반전 대기 2.5초는 통신이 흔들리던 시절의
최대값에 맞춘 숫자라, 지금 다시 재면 원래의 1.5초 언저리로 돌아갈 겁니다. 세정 한 회에
반전이 여러 번 들어가니 그만큼이 그대로 세정 시간입니다. 측정에 쓰려고 회전 중 폴링 주기를
설정에서 바꿀 수 있게 해 뒀습니다.

응답 대기를 150ms로 줄인 건 되돌리지 않습니다. 정상 응답의 세 배 여유는 그대로 맞는
값이고, 혹시 다시 잡음이 들어와도 손실을 작게 묶어 줍니다.

## 남는 생각

돌아보면 순서가 맞았다고 생각합니다. 먼저 계측으로 "내 코드의 대기"와 "통신 자체"를 갈랐고,
통신 문제라는 걸 확인한 뒤에는 소프트웨어로 **손실**을 줄여 장비가 돌아가게 했습니다. 그리고
그 커밋에 소프트웨어가 못 고치는 것을 적어 뒀습니다.

그 한 줄이 없었다면, 장비가 돌아가는 순간 문제는 해결된 것처럼 보였을 겁니다. 반전 대기
2.5초는 원래 그런 값인 것처럼 남았을 거고, 다섯 번에 한 번 말이 전달되지 않는 장비가
출하됐을 겁니다.

소프트웨어는 잡음을 견디게 만들 수는 있어도, 잡음을 없앨 수는 없습니다. 그건 선 한 가닥의
몫이었습니다.
