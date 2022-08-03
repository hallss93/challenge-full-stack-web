FROM node
ENV NODE_ENV=development
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install @vue/cli@3.7.0 -g
EXPOSE 8080