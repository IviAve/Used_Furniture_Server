FROM node:22

ENV PORT=8080

WORKDIR /usr/src/app

COPY package*.json ./



COPY . .

EXPOSE 8080

CMD ["npm", "start"]

