FROM node:lts-alpine
RUN npm i -g pnpm
WORKDIR /app
COPY ./dist/apps/backend .
ENV PORT=8000
EXPOSE ${PORT}
RUN pnpm install
RUN pnpm add pg
CMD node ./main.js