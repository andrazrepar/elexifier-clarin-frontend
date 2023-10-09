FROM node:20-alpine3.17

WORKDIR /elexifier

add . /elexifier

RUN npm install
RUN npm build

EXPOSE 4173

CMD ["npm", "run", "dev", "--host"]
