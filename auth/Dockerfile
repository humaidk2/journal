FROM node:12


RUN npm install -g nodemon ts-node

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install && npm cache clean --force

COPY . .

EXPOSE 3000

CMD ["nodemon"]
