# Use Bun's official image
FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
FROM base AS install
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# Copy application code
FROM base AS prerelease
COPY --from=install /temp/prod/node_modules node_modules
COPY . .

# Final production image
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /app/src ./src
COPY --from=prerelease /app/public ./public
COPY --from=prerelease /app/package.json .

# Create non-root user
RUN addgroup --system --gid 1001 bunapp && \
    adduser --system --uid 1001 bunapp
USER bunapp

# Expose port
EXPOSE 3000

# Start the application
CMD ["bun", "src/index.ts"]
