import { describe, expect, it } from 'vitest';
import { useTranslations } from './utils';
import { defaultLang, languages } from './ui';

describe('useTranslations', () => {
  it('기본 언어의 문구를 반환한다', () => {
    const t = useTranslations('ko');
    expect(t('nav.blog')).toBe('블로그');
  });

  it('모든 키가 빈 문자열이 아니다', () => {
    const t = useTranslations('ko');
    const keys = ['nav.about', 'nav.projects', 'nav.blog'] as const;
    for (const key of keys) {
      expect(t(key).length).toBeGreaterThan(0);
    }
  });
});

describe('languages', () => {
  it('현재는 한국어 하나만 활성화되어 있다', () => {
    expect(Object.keys(languages)).toEqual(['ko']);
  });

  it('기본 언어가 활성 언어 목록에 들어 있다', () => {
    expect(Object.keys(languages)).toContain(defaultLang);
  });
});
