📘 우리말 배틀 (Woorimal Battle)


우리말 어휘 학습을 재미있게!

랜덤으로 문제를 출제하고, 힌트를 주고, 직접 풀어볼 수 있는 우리말 퀴즈 앱 🎉


🚀 주요 기능


✅ 랜덤 문제 출제 : 사전 데이터를 기반으로 어휘 퀴즈 생성


✅ 힌트 제공 : 초성 힌트 / 띄어쓰기 표시


✅ 문제 저장 & 복습 모드 : 나만의 문제집 만들기


✅ 필터링 기능 :


📌 구성 단위 선택

📌 고유어 여부 선택

📌 품사 선택


✅ 점수 기록 : 정답률 확인 가능



⚙️ 실행 방법

1️⃣ 프로젝트 클론

git clone https://github.com/realchaeso/Woorimal_Battle.git
cd Woorimal_Battle


2️⃣ 의존성 설치

npm install


3️⃣ 개발 서버 실행

npm start


4️⃣ 배포 (GitHub Pages)

npm run build
npm run deploy


📂 프로젝트 구조
Woorimal_Battle/

├── public/

│   ├── words_jsons/       # 변환된 JSON 문제 데이터

│   └── king.jpeg          # 메인 이미지

├── scripts/

│   ├── convertExcelToJson.js   # Excel → JSON 변환 스크립트

│   └── generateFileList.js     # JSON 파일 목록 생성

├── src/

│   ├── App.js             # 메인 로직

│   └── App.css            # 스타일

└── package.json


🙌 만든 사람

realchaeso 🥬


⭐ 기여 & 라이선스

이 프로젝트는 학습 및 개인 프로젝트용으로 제작되었습니다.

자유롭게 Fork, 수정, 개선 제안 모두 환영합니다!
