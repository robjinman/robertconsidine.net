FROM node:10.15-stretch

WORKDIR /usr/app

COPY package*.json ./

RUN npm ci --only=production
RUN npm install pm2 -g
RUN npm install prisma@1.32 -g

COPY deployment/api/start.sh .
COPY . .

EXPOSE 4000

CMD ["./start.sh"]
