FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install && npm install -g jest
COPY . .
CMD ["npm", "test"]
