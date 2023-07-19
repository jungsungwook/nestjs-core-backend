FROM node:19

USER root

RUN apt-get update
RUN apt-get upgrade -y

RUN npm i -g nodemon

RUN apt-get install git -y

WORKDIR /home

RUN git clone https://github.com/yourname/yourrepourl.git ./filename
WORKDIR /home/filename
RUN npm install

WORKDIR /home