FROM node:19

WORKDIR /home

ENV HOME /home
ENV NODE_ENV=development

RUN apt update
RUN npm i -g nodemon

RUN git clone https://github.com/yourname/yourrepourl.git ./filename
WORKDIR /home/filename
RUN npm install

WORKDIR /home