FROM node:20

WORKDIR /app
COPY package*.json .
RUN npm install --include=dev
COPY . .
CMD npm start