FROM node:lts-alpine
WORKDIR /app
COPY ./dist/apps/backend .
ENV PORT=9000
EXPOSE ${PORT}
RUN yarn install
RUN yarn add pg
CMD node ./main.js