FROM node:12.3.0

RUN npm i npm@latest -g

RUN npm install -g nodemon ts-node


WORKDIR /usr/src/app

COPY package.json package-lock.json* ./

RUN npm install --no-optional && npm cache clean --force
COPY . .

EXPOSE 3000

CMD ["nodemon"]
