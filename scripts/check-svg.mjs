// 마크다운에 인라인으로 넣은 SVG 안에 빈 줄이 있으면, 빈 줄 다음의 <text> 줄을 변환기가
// 문단으로 감싸 <p> 를 끼워 넣는다. 브라우저는 SVG 안의 <p> 에서 그림을 끊어 버리므로
// 그림이 통째로 안 보이는데, 빌드는 오류 없이 통과한다. 그래서 산출물을 직접 검사한다.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const walk = (d) =>
  readdirSync(d, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)],
  );

const bad = new Set();
for (const f of walk('dist').filter((f) => f.endsWith('.html'))) {
  const html = readFileSync(f, 'utf8');
  for (const m of html.matchAll(/<svg[\s\S]*?<\/svg>/g)) {
    if (/<\/?p\b/.test(m[0])) bad.add(f);
  }
}
if (bad.size) {
  throw new Error(
    `SVG 안에 <p> 가 끼어들었습니다(마크다운의 그림 안 빈 줄을 지우세요):\n  ${[...bad].join('\n  ')}`,
  );
}
console.log('SVG 검사 통과');
