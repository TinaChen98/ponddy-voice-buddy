FROM node:12.16.1-alpine as builder

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json /usr/src/app/
RUN npm ci

COPY ./ /usr/src/app

RUN npm run build

EXPOSE 4000
ARG PROJECT_NAME
ENV PROJECT_NAME=$PROJECT_NAME
CMD ["npm", "start"]
