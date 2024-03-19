# FROM node:18.12.0 As development

# WORKDIR /usr/src/app

# COPY package*.json ./

# RUN npm cache clean --force && \
#     npm install -g npm@8.13.2 && \
#     npm install

# COPY . .

# RUN npm run build

# FROM node:18.12.0 As production

# ARG NODE_ENV=production
# ENV NODE_ENV=${NODE_ENV}
# WORKDIR /usr/src/app

# COPY package*.json ./
# COPY movie.mp4 ./

# RUN npm cache clean --force && \
#     npm install -g npm@8.13.2 && \
#     npm install --only=production --omit=dev

# COPY --from=development /usr/src/app/dist ./dist

# # CMD ["npm", "run", "start:dev", "transcoder"]
# CMD ["node", "dist/apps/transcoder/apps/transcoder/src/main"]

FROM node

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

CMD ["node", "dist/apps/transcoder/apps/transcoder/src/main"]
