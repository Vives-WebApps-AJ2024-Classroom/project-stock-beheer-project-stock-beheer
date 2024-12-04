FROM node:latest AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

ARG BACKEND_URL
ENV REACT_APP_BACKEND_URL=$BACKEND_URL

COPY . .

EXPOSE 3000

CMD ["npm", "start"]