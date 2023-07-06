FROM node:lts-buster AS build
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . ./
RUN npm run build
RUN npm prune --production

FROM nginx:stable-alpine-slim
COPY --from=build /app/dist /usr/share/nginx/html
