FROM node:20-alpine

WORKDIR /app

# Copy manifests first for layer caching
COPY package*.json ./
RUN npm ci --only=production

# Copy compiled output (run `npm run build` before docker build)
COPY dist/ ./dist/

ENV MODE=http
ENV PORT=8080

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:8080/health || exit 1

CMD ["node", "dist/index.js"]
