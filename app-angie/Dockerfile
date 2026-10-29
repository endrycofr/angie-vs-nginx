# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.23.4
# ---------- Base ----------
FROM node:${NODE_VERSION}-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
# Versi pnpm diambil dari field "packageManager" di package.json
RUN corepack enable
WORKDIR /app

# ---------- Dependencies produksi ----------
FROM base AS prod-deps
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --prod

# ---------- Runtime ----------
FROM base AS runner
ENV NODE_ENV=production \
    PORT=3000

# init process kecil agar sinyal & zombie process ditangani benar
RUN apk add --no-cache tini

COPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node . .

# Jalankan sebagai user non-root bawaan image node
USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:${PORT}/health || exit 1

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "index.js"]
