FROM node:lts
LABEL maintainer "Matthias_Sebastian"
LABEL org.opencontainers.image.source="https://github.com/maetzl/ice_backend"

WORKDIR /usr/app  

ENV NODE_ENV=development
ENV PORT=3001
ENV LOG_LEVEL=debug
ENV CORS_URLS=http://example.com
ENV DB_HOST=mongodb://mongo:2s0ysB1rDIWJ1hrjEZzh@containers-us-west-56.railway.app:6241
ENV PGSSLMODE=disable

RUN npm install -f @swc/core-linux-arm64-gnu

COPY . /usr/app

ENTRYPOINT ["npm", "run", "start"]