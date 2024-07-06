# FROM node

# WORKDIR /usr/src/app

# COPY package*.json .

# RUN npm install

# COPY . .

FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json .

# RUN npm cache clean --force && \
#     npm install -g npm@8.13.2 && \
#     npm install
RUN npm install

COPY . .

RUN npm run build:api

CMD ["node", "dist/apps/blog/main.js"]