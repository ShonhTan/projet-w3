FROM node:12-alpine

WORKDIR /app

COPY ./package.json .
COPY ./yarn.lock .

RUN yarn install --production=true --pure-lockfile

COPY . .

EXPOSE 3000

ENV NODE_ENV=production

CMD ["npm", "run", "start"]
