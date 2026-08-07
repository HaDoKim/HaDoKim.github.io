export const defaultLang = 'ko' as const;

/** 활성 언어. 여기에 en을 추가하면 언어 전환 버튼이 자동으로 나타난다. */
export const languages = {
  ko: '한국어',
} as const;

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
