# node 버전 선택
FROM node:18-alpine

# /app 디렉토리에서 실행
RUN mkdir -p /app
WORKDIR /app

# 프로젝트 전체를 워크 디렉토리에 복사
ADD . /app

# 의존성 설치
RUN npm install

# nest.js 빌드
RUN npm run build

# 포트 개방
EXPOSE 3000

# 실행
ENTRYPOINT npm run start:prod