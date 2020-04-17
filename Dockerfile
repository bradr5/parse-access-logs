FROM node:13-slim

# define app directory
ARG APP_HOME=/app

# add project directory
RUN mkdir -p ${APP_HOME}
WORKDIR ${APP_HOME}

# install and cache app dependencies
COPY package.json package-lock.json ./
RUN npm install

# copy all project files
COPY . ./

CMD ["node", "parse.js"]
