# Stage 1: Build React app
FROM node:22 AS build

WORKDIR /app

# Declare build arguments
ARG REACT_APP_PIXBAY_KEY
ARG REACT_APP_CLERK_PUBLISHABLE_KEY
ARG REACT_APP_HOST_URL

# Set environment variables for the build
ENV REACT_APP_PIXBAY_KEY=$REACT_APP_PIXBAY_KEY
ENV REACT_APP_CLERK_PUBLISHABLE_KEY=$REACT_APP_CLERK_PUBLISHABLE_KEY
ENV REACT_APP_HOST_URL=$REACT_APP_HOST_URL

# Static environment variables
ENV NEW_RELIC_NO_CONFIG_FILE=true
ENV NEW_RELIC_DISTRIBUTED_TRACING_ENABLED=true
ENV NEW_RELIC_LOG=stdout

# Install deps (React + Express in one package.json)
# --legacy-peer-deps: liquid-glass-react declares a peer dep on react>=19,
# but its code only uses forwardRef/useId (both React 18-safe) — no
# React-19-only APIs — so it works fine on our react@18. Same flag used for
# local `npm install`; keeping this in sync avoids exactly this mismatch.
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy rest of the code
COPY public ./public
COPY src ./src
COPY index.html .
COPY vite.config.mjs .
COPY reactServer.js .


# Build React app
RUN npm run build

# Stage 2: Run with Express
FROM node:22

WORKDIR /app
ENV TZ=Asia/Kolkata
# Copy only what's needed to run the server and serve static files
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/reactServer.js ./reactServer.js
COPY --from=build /app/build ./build

# Expose app port
EXPOSE 3000

# Run the Express server
CMD ["node","-r","newrelic","reactServer.js"]
