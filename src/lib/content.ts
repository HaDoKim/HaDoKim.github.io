/**
 * 콘텐츠 엔트리의 id는 컬렉션 base 기준 상대 경로에서 확장자를 뺀 값이다.
 * 예: src/content/blog/ko/2026-08-07-hello.md → "ko/2026-08-07-hello"
 */

const DATE_PREFIX = /^\d{4}-\d{2}-\d{2}-/;

/** id가 언어 폴더 구간을 가지고 있는지 검증한다. */
function guardValidId(id: string): void {
  const segments = id.split('/');
  if (segments.length < 2) {
    throw new Error(
      `콘텐츠 id '${id}'에 언어 폴더 구간이 없습니다. 콘텐츠는 언어 폴더 아래에 위치해야 합니다 (예: ko/파일명).`,
    );
  }
}

/** id의 첫 구간(언어 폴더)을 돌려준다. */
export function localeOf(id: string): string {
  guardValidId(id);
  return id.split('/')[0];
}

/** URL에 쓰는 slug. 언어 폴더와 맨 앞 날짜 접두사를 제거한다. */
export function slugOf(id: string): string {
  guardValidId(id);
  const withoutLocale = id.split('/').slice(1).join('/');
  return withoutLocale.replace(DATE_PREFIX, '');
}

/** 초안 제외 필터. includeDrafts가 true면 그대로 통과시킨다. */
export function filterVisible<T extends { data: { draft: boolean } }>(
  entries: T[],
  includeDrafts: boolean,
): T[] {
  return includeDrafts ? entries : entries.filter((e) => !e.data.draft);
}

/** 최신순 정렬 비교 함수. */
export function byDateDesc(
  a: { data: { date: Date } },
  b: { data: { date: Date } },
): number {
  return b.data.date.getTime() - a.data.date.getTime();
}

/** 태그별 게시글 수를 센다. 개수 내림차순, 동률이면 이름 오름차순으로 정렬한다. */
export function tagCounts<T extends { data: { tags: string[] } }>(
  posts: T[],
): { name: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

/** 앞에서 n개만 취한다. */
export function topN<T>(entries: T[], n: number): T[] {
  return entries.slice(0, n);
}

/** 화면 표시용 날짜. 시간대에 흔들리지 않도록 UTC 기준으로 읽는다. */
export function formatDate(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}.${m}.${d}`;
}
