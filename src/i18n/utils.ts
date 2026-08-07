import { defaultLang, ui, type Lang, type UIKey } from './ui';

/**
 * 해당 언어의 문구 조회 함수를 돌려준다.
 * 번역이 빠진 키는 기본 언어 값으로 대체하므로 화면에 빈칸이 나오지 않는다.
 */
export function useTranslations(lang: Lang) {
  return function t(key: UIKey): string {
    const table = ui[lang] as Record<string, string>;
    const fallback = ui[defaultLang] as Record<string, string>;
    return table[key] ?? fallback[key];
  };
}
