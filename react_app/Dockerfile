# Stage 1: Build React app
FROM node:20.9.0 AS build

WORKDIR /app

# Static environment variables
ENV NEW_RELIC_NO_CONFIG_FILE=true
ENV NEW_RELIC_DISTRIBUTED_TRACING_ENABLED=true
ENV NEW_RELIC_LOG=stdout

# Install deps (React + Express in one package.json)
COPY package*.json ./
RUN npm install

# Copy rest of the code
COPY public ./public
COPY src ./src
COPY reactServer.js .
    

# Build React app
RUN npm run build

# Stage 2: Run with Express
FROM node:20.9.0

WORKDIR /app

# Copy only what's needed to run the server and serve static files
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/reactServer.js ./reactServer.js
COPY --from=build /app/build ./build

# Expose app port
EXPOSE 3000

# Run the Express server
CMD ["node","-r","newrelic","reactServer.js"]
