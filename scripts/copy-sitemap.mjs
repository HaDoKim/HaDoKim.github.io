// @astrojs/sitemap 은 sitemap-index.xml → sitemap-0.xml 두 단계로 만든다.
// Search Console 이 인덱스 파일을 "가져올 수 없음"으로 붙잡고 있어, 관례 이름인
// sitemap.xml 로 페이지 목록을 바로 담은 사본을 하나 더 둔다.
// 페이지가 늘어 sitemap-1.xml 이 생기면(45,000개 초과) 사본만으로는 부족하니 빌드를 멈춘다.
import { copyFileSync, existsSync } from 'node:fs';

if (existsSync('dist/sitemap-1.xml')) {
  throw new Error('sitemap-1.xml 이 생겼습니다. sitemap.xml 사본 방식을 다시 검토하세요.');
}
copyFileSync('dist/sitemap-0.xml', 'dist/sitemap.xml');
console.log('dist/sitemap.xml 생성');
