FROM node:12 as build

WORKDIR /home/app

COPY package.json .
COPY ./yarn.lock .

RUN yarn install --production=true --pure-lockfile

COPY . .

ARG REACT_APP_API_URL

RUN npm run build



FROM nginx:alpine

COPY --from=build /home/app/build /usr/share/nginx/html

COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
