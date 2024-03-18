FROM node:18.12.0 As development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm cache clean --force && \
    npm install -g npm@8.13.2 && \
    npm install

COPY . .

RUN npm run build

FROM node:18.12.0 As production

ARG NODE_ENV=production
# ENV RABBIT_MQ_URI=amqps://gncchebv:ajE60Bz7Ry9nc0O0lTYCulW2I64o9vFJ@gerbil.rmq.cloudamqp.com/gncchebv
# ENV RABBIT_MQ_SERVICE_QUEUE=main_queue
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm cache clean --force && \
    npm install -g npm@8.13.2 && \
    npm install --only=production --omit=dev

COPY --from=development /usr/src/app/dist ./dist

CMD ["npm", "run", "start:dev", "transcoder"]
# CMD ["node", "dist/apps/transcoder/apps/transcoder/src/main"]