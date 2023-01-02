FROM node:lts-alpine
ENV NODE_ENV=production
RUN npm install --global nodemon
WORKDIR /home/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . /home/app
EXPOSE 3002
EXPOSE 3001
RUN chown -R node /home/app
USER node
CMD ["npm", "start"]
