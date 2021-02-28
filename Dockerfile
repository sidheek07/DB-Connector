## The builder
FROM node:12-alpine as builder
WORKDIR /usr/src/app
ENV OPENCOLLECTIVE_HIDE=1
ENV SUPPRESS_SUPPORT=1
COPY package.json package-lock.json ./
RUN npm i --loglevel error
COPY . .
RUN npm run build