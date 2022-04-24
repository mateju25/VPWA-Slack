
# Include the latest node image
FROM node:lts
# Aliases setup for container folders
ARG SERVER="/backend-adonis"
ARG SERVER_src="."
ARG BUILD="/backend-adonis/build"

ENV PORTS="3333"
ENV PORT=3333
ENV HOST=127.0.0.1
ENV NODE_ENV=production
ENV APP_KEY=eYZymfcOgP1puFESrcrjK12rqX24j8Sb
ENV DRIVE_DISK=local
ENV DB_CONNECTION=pg
ENV PG_HOST=localhost
ENV PG_PORT=5433
ENV PG_USER=postgres
ENV PG_PASSWORD=Korespondent2000
ENV PG_DB_NAME=vpwa


# Set the working directory inside the container to server module
WORKDIR ${SERVER}
# Expose port outside container
EXPOSE ${PORTS}
# Copy server module
COPY ${SERVER_src} ${SERVER}
# Build TS files
RUN npm install
RUN node ace build --production
# Update workdir
WORKDIR ${BUILD}
# Install production dependencies
RUN npm ci --production
## Initialize Sqlite
#RUN mkdir tmp && touch db.sqlite3
# Start server module inside the container
CMD ["node", "server.js"]
