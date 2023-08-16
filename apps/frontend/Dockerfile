FROM node:lts-alpine as build
WORKDIR /app
COPY ./dist/apps/frontend .
RUN yarn install

FROM nginx:alpine AS react-nx-ui
COPY nginx.conf /etc/nginx/nginx.conf
WORKDIR /usr/share/nginx/html
COPY --from=react-nx-base /app/dist/apps/react-nx-docker .

