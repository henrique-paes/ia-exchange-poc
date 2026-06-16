# Dev image: openssl (needed by Prisma) installed as root at build time,
# then drop to the unprivileged `node` user (uid/gid 1000) so files written
# to the bind-mounted /app are owned by the host user, not root.
FROM node:24-alpine
RUN apk add --no-cache openssl
USER node
WORKDIR /app
