FROM node:14-alpine

# App directory
WORKDIR /usr/src/app

# Dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

EXPOSE 8080
CMD ["npm", "run", "start"]