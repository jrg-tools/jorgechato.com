# Base image with Node.js and pnpm
FROM node:lts-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

# Install only production dependencies
FROM base AS prod-deps
ENV NODE_ENV=production
RUN pnpm install --frozen-lockfile --prod

# Install all dependencies for building
FROM base AS build-deps
RUN pnpm install --frozen-lockfile

# Build stage
FROM build-deps AS build
COPY . .
RUN pnpm run build

# Production image
FROM node:lts-alpine AS runtime

WORKDIR /app

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=80
EXPOSE 80/tcp

ENTRYPOINT ["node", "./dist/server/entry.mjs"]
