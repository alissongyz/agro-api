# Etapa 1 - Build
FROM node:20-slim AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa 2 - Runtime
FROM node:20-slim

RUN useradd -m appuser
USER appuser

WORKDIR /home/appuser/app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

RUN npm ci --omit=dev

CMD ["npm", "run", "start:prod"]
