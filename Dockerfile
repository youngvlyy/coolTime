# ========== 1단계: 클라이언트(React) 빌드 ==========
FROM node:18 AS client-build

WORKDIR /app
COPY client ./client
COPY package.json package-lock.json ./

# client dependencies 설치
RUN cd client && npm install && npm run build


# ========== 2단계: 서버(Express) 빌드 ==========
FROM node:18 AS server-build

WORKDIR /app
COPY server ./server
COPY package.json package-lock.json tsconfig.json ./

# 서버 dependencies 설치 + 빌드
RUN cd server && npm install && npm run build


# ========== 최종 단계 ==========
FROM node:18

WORKDIR /app

# 서버 실행에 필요한 것만 복사
COPY --from=server-build /app/server/dist ./server/dist
COPY --from=server-build /app/server/node_modules ./server/node_modules
COPY --from=client-build /app/client/dist ./client/dist
COPY package.json ./

EXPOSE 4000

CMD ["node", "server/dist/index.js"]
