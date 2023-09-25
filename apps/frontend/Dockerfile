FROM node:lts-alpine as build
RUN npm i -g pnpm
WORKDIR /app
COPY ./dist/apps/frontend .
RUN pnpm install

FROM nginx:alpine AS react-nx-ui
COPY apps/frontend/default.conf /etc/nginx/conf.d/default.conf
WORKDIR /usr/share/nginx/html
COPY --from=build /app .

CMD ["nginx", "-g", "daemon off;"]