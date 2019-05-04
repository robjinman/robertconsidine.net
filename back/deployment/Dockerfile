FROM node:10.15-stretch

WORKDIR /usr/app

COPY package*.json ./

RUN npm ci --only=production
RUN npm install pm2 -g

COPY . .

EXPOSE 4000
CMD ["pm2-runtime", "index.js"]
