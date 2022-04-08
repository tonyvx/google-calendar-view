FROM node

COPY node_modules ./node_modules

COPY src ./src

COPY .env .

COPY package-lock.json .

COPY package.json .

RUN ls -al

CMD npm start
