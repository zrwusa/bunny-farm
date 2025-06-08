# web.Dockerfile
FROM node:22-alpine

WORKDIR /app

COPY docker .

WORKDIR /app/apps/web

RUN npm ci
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
