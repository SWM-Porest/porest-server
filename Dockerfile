# node 버전 선택
FROM node:18-alpine

# SENTRY 환경변수
ENV SENTRY_AUTH_TOKEN=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

# /app 디렉토리에서 실행
RUN mkdir -p /app
WORKDIR /app

# 프로젝트 전체를 워크 디렉토리에 복사
ADD . /app

# sentry cli 설치
RUN npm install @sentry/cli

# 의존성 설치
RUN npm install

# pm2 설치
RUN npm install pm2 -g

# nest.js 빌드
RUN npm run build

# 포트 개방
EXPOSE 3000

# 실행
ENTRYPOINT pm2 start ecosystem.config.js --no-daemon
