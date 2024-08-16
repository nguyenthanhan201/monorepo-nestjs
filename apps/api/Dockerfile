##################
# BUILD BASE IMAGE
##################

FROM node:20-alpine AS base

#############################
# BUILD FOR LOCAL DEVELOPMENT
#############################

FROM base As development
WORKDIR /app
RUN chown -R node:node /app

COPY --chown=node:node package*.json ./

# Install all dependencies (including devDependencies)
RUN npm install

# Bundle app source
COPY --chown=node:node . .

# Use the node user from the image (instead of the root user)
USER node

#####################
# BUILD BUILDER IMAGE
#####################

FROM base AS builder
WORKDIR /app

COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=development /app/node_modules ./node_modules
COPY --chown=node:node --from=development /app/apps/api/src ./apps/api/src
COPY --chown=node:node --from=development /app/libs ./libs
COPY --chown=node:node --from=development /app/tsconfig.json ./tsconfig.json
COPY --chown=node:node --from=development /app/tsconfig.build.json ./tsconfig.build.json
COPY --chown=node:node --from=development /app/apps/api/tsconfig.app.json ./apps/api/tsconfig.app.json
COPY --chown=node:node --from=development /app/nest-cli.json ./nest-cli.json

RUN npm run build:api

# Removes unnecessary packages adn re-install only production dependencies
ENV NODE_ENV production
# RUN pnpm prune --prod
RUN npm install --prod
  
USER node

######################
# BUILD FOR PRODUCTION
######################

FROM node:20-alpine AS production
WORKDIR /app

RUN mkdir -p src/generated && chown -R node:node src

# Copy the bundled code from the build stage to the production image
# COPY --chown=node:node --from=builder /app/src/generated/i18n.generated.ts ./src/generated/i18n.generated.ts
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node --from=builder /app/package.json ./

USER node

# Start the server using the production build
CMD ["npm", "run", "start:api"]