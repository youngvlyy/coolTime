# ---------- Server build ----------
FROM node:20 AS server-build
WORKDIR /app

# 루트 package.json 사용
COPY package*.json ./
RUN npm install

# 서버 코드 복사
COPY server ./server
RUN npm run build   # build 스크립트에서 server 빌드하도록 설정되어 있어야 함

# ---------- Client build ----------
FROM node:20 AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ .
RUN npm run build

# ---------- Production ----------
FROM node:20 AS production
WORKDIR /app

# 서버 빌드 산출물 복사
COPY --from=server-build /app/server/dist ./server/dist
COPY package*.json ./

# 클라이언트 빌드된 정적 파일
COPY --from=client-build /app/client/dist ./client/dist

RUN npm install --only=production

EXPOSE 4000
CMD ["node", "server/dist/index.js"]
