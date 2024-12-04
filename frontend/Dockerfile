FROM node:latest AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

ARG VITE_BACKEND_URL

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]