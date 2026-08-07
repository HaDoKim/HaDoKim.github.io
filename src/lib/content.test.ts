import { describe, expect, it } from 'vitest';
import {
  byDateDesc,
  filterVisible,
  formatDate,
  localeOf,
  slugOf,
  topN,
} from './content';

describe('localeOf', () => {
  it('id의 첫 구간을 언어로 읽는다', () => {
    expect(localeOf('ko/2026-08-07-hello')).toBe('ko');
    expect(localeOf('en/2026-08-07-hello')).toBe('en');
  });
});

describe('slugOf', () => {
  it('언어 폴더와 날짜 접두사를 제거한다', () => {
    expect(slugOf('ko/2026-08-07-hello')).toBe('hello');
  });

  it('날짜 접두사가 없으면 언어 폴더만 제거한다', () => {
    expect(slugOf('ko/sample-project')).toBe('sample-project');
  });

  it('slug 안의 하이픈과 숫자를 보존한다', () => {
    expect(slugOf('ko/2026-08-07-astro-7-upgrade')).toBe('astro-7-upgrade');
  });

  it('날짜처럼 보이는 문자열이 slug 중간에 있어도 건드리지 않는다', () => {
    expect(slugOf('ko/2026-08-07-retro-2025-01-01')).toBe('retro-2025-01-01');
  });
});

describe('filterVisible', () => {
  const entries = [
    { data: { draft: false } },
    { data: { draft: true } },
  ];

  it('초안을 제외한다', () => {
    expect(filterVisible(entries, false)).toHaveLength(1);
  });

  it('초안 포함 모드에서는 전부 남긴다', () => {
    expect(filterVisible(entries, true)).toHaveLength(2);
  });
});

describe('byDateDesc', () => {
  it('최신 날짜가 앞으로 온다', () => {
    const entries = [
      { data: { date: new Date('2026-01-01') } },
      { data: { date: new Date('2026-08-07') } },
    ];
    const sorted = [...entries].sort(byDateDesc);
    expect(sorted[0].data.date.getFullYear()).toBe(2026);
    expect(sorted[0].data.date.getMonth()).toBe(7);
  });
});

describe('topN', () => {
  it('앞에서 n개만 남긴다', () => {
    expect(topN([1, 2, 3, 4, 5], 3)).toEqual([1, 2, 3]);
  });

  it('개수가 모자라면 있는 만큼만 돌려준다', () => {
    expect(topN([1, 2], 3)).toEqual([1, 2]);
  });
});

describe('formatDate', () => {
  it('YYYY.MM.DD 형식으로 만든다', () => {
    expect(formatDate(new Date('2026-08-07T00:00:00Z'))).toBe('2026.08.07');
  });
});
