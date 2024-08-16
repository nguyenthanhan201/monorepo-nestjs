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
# RUN npm ci --only=production
RUN npm install 

COPY . .

# RUN npm run build:blog

# CMD ["node", "dist/apps/blog/main.js"]
# CMD ["npm", "run", "start:blog"]
CMD ["npm", "run", "dev:blog"]