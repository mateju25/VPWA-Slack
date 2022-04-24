# ----- BUILD STAGE -----
FROM node:lts as build-stage
# Aliases setup for container folders
ARG PWA_src="."
ARG DIST="/pwa"
# Define arguments which can be overridden at build time
ENV API_URL="localhost:3333"
# Set the working directory inside the container to server module
WORKDIR ${DIST}
# Copying in two separate steps allows us to take advantage of cached Docker layers.
COPY ${PWA_src}/package*.json ./
# Install dependencies
RUN npm install
# Copy source files inside container
COPY ${PWA_src} .
# Build the SPA
RUN npx @quasar/cli build -m pwa --debug
# ----- PRODUCTION STAGE -----
FROM node:lts as production-stage
# Aliases setup for container folders
ARG DIST="/pwa"
ARG PWA="/myapp"
# Define environment variables for HTTP server
ENV HOST="127.0.0.1"
ENV PORT="4000"
# Set working directory
WORKDIR ${PWA}
# Copy build artifacts from previous stage
COPY --from=build-stage ${DIST}/dist/pwa ./
# Expose port outside container
EXPOSE ${PORT}
# Install pm2
RUN npm install -g @quasar/cli
# Start server module inside the container
CMD ["quasar", "serve"]
