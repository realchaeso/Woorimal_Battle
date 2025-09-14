# Woorimal_Battle

우리말 겨루기 프로젝트 📝

이 프로젝트는 React를 기반으로 만든 우리말 학습용 게임입니다.  
사용자는 한글 단어의 뜻풀이를 보고 정답을 입력하며, 힌트와 저장/복습 기능을 사용할 수 있어요!!

## 사용 방법

### `npm start`
개발 모드에서 앱을 실행합니다.  
브라우저에서 [http://localhost:3000](http://localhost:3000) 을 열어 확인할 수 있어요.  

### `npm run build`
프로덕션용으로 빌드합니다.  
`build` 폴더에 최적화된 파일이 생성되고, gh-pages 등으로 배포 가능해요.

### `npm run deploy`
GitHub Pages로 배포합니다.  
`package.json`의 `homepage` 설정을 기반으로 배포됨.

## 기능
- 문제풀기, 힌트 추가, 점수판
- 문제 저장 및 복습
- 구성 단위 / 고유어 여부 / 품사 필터링

## 프로젝트 구조
- `src/` : React 컴포넌트, 스타일, JSON 데이터
- `public/` : 정적 파일 (이미지, words_data.json)

---

즐겁게 우리말 겨루기 해보세요! 🎉
