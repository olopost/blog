FROM node:lts-buster AS build
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . ./
RUN npm run build

FROM nginx:stable-alpine-slim
COPY --from=build /app/dist /usr/share/nginx/html
