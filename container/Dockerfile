# ─── Build stage ─────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# ─── Runtime stage ────────────────────────────────────────────────────────────
FROM nginx:1.27-alpine AS runtime

LABEL org.opencontainers.image.title="ether-chat-web"
LABEL org.opencontainers.image.description="Generic PWA chat frontend for AI agents"
LABEL org.opencontainers.image.source="https://github.com/rafex/ether/ether-chat-web"

COPY --from=builder /app/dist /usr/share/nginx/html
COPY container/nginx.conf /etc/nginx/conf.d/default.conf

# Nginx runs on 8080 to avoid requiring root
RUN sed -i 's/listen\s*80;/listen 8080;/g' /etc/nginx/conf.d/default.conf \
    && chown -R nginx:nginx /usr/share/nginx/html \
    && chmod -R 755 /usr/share/nginx/html

USER nginx
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:8080/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
