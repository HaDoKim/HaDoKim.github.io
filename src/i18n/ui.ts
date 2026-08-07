export const defaultLang = 'ko' as const;

/**
 * 문자열 표에 등록된 언어(번역 라벨 포함). en 확장은 여기서 끝나지 않는다 —
 * 여기에 항목을 추가하는 것은 "번역 문자열이 존재한다"는 뜻일 뿐, 사이트에
 * 실제 언어가 생기는 것은 아니다. 새 언어를 살아있는 언어로 만들려면:
 *   1. 이 languages 객체에 라벨 추가
 *   2. astro.config.mjs의 i18n.locales에 등록
 *   3. src/pages/en/ 이하에 실제 페이지 라우트 생성
 *   4. 위 세 가지를 모두 마친 뒤에만 아래 liveLocales에 추가한다.
 * liveLocales에 없는 언어는 LangSwitcher가 링크를 그리지 않는다.
 */
export const languages = {
  ko: '한국어',
} as const;

/**
 * 실제로 라우트가 존재하는("살아있는") 언어만 나열한다.
 * LangSwitcher는 languages 전체가 아니라 이 목록만 읽어 링크를 그린다.
 */
export const liveLocales: readonly (keyof typeof languages)[] = ['ko'];

export const ui = {
  ko: {
    'site.title': 'IanKim',
    'site.description': '만든 것과 배운 것을 기록하는 공간',

    'nav.home': '홈',
    'nav.about': '소개',
    'nav.projects': '프로젝트',
    'nav.blog': '블로그',

    'home.featured': '주요 프로젝트',
    'home.recent': '최근 글',
    'home.more.projects': '프로젝트 전체 보기',
    'home.more.blog': '글 전체 보기',

    'post.date': '작성일',
    'post.tags': '태그',
    'post.prev': '이전 글',
    'post.next': '다음 글',
    'post.draft': '초안',

    'project.stack': '사용 기술',
    'project.repo': '저장소',
    'project.demo': '데모',

    'blog.empty': '아직 올린 글이 없습니다.',
    'projects.empty': '아직 올린 프로젝트가 없습니다.',
    'tags.title': '태그',
    'tags.heading': '태그별 글',

    'theme.toggle': '다크 모드 전환',

    'notfound.title': '페이지를 찾을 수 없습니다',
    'notfound.body': '주소가 바뀌었거나 삭제된 페이지입니다.',
    'notfound.home': '홈으로',
    'notfound.blog': '글 목록으로',

    'footer.rss': 'RSS',
  },
  // en: { ... }  ← 영어 확장 지점. 위 키를 그대로 복사해 값만 번역한다.
} as const;

export type Lang = keyof typeof ui;
export type UIKey = keyof (typeof ui)[typeof defaultLang];
