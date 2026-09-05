FROM node:22-alpine AS base
RUN npm install --global pnpm@10.30.2 \
  && mkdir -p /app \
  && chown -R node:node /app
WORKDIR /app

FROM base AS dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

FROM dependencies AS build
COPY . .
# Runtime validates the real deployment secret; this value exists only so the
# framework can compile server modules without needing deployment credentials.
RUN BETTER_AUTH_SECRET=build-only-secret-never-used-at-runtime-32-characters pnpm build

FROM base AS runtime
ENV NODE_ENV=production
COPY --chown=node:node --from=build /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --chown=node:node --from=build /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/.next ./.next
COPY --chown=node:node --from=build /app/public ./public
COPY --chown=node:node --from=build /app/src ./src
COPY --chown=node:node --from=build /app/drizzle ./drizzle
COPY --chown=node:node --from=build /app/drizzle.config.ts ./drizzle.config.ts
COPY --chown=node:node --from=build /app/tsconfig.json ./tsconfig.json
USER node
EXPOSE 3000
CMD ["pnpm", "start"]
