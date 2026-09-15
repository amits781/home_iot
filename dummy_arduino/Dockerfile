FROM node:22-alpine

WORKDIR /app

# No dependencies to install (plain Node http module), just the two files.
COPY package.json server.js ./

ARG PORT=8081
ENV PORT=$PORT
EXPOSE $PORT

CMD ["node", "server.js"]
