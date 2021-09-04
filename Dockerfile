FROM mhart/alpine-node:10.24.1
WORKDIR /usr/app
COPY package.json .
RUN npm install --quiet
COPY . .
