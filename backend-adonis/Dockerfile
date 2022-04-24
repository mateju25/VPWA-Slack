FROM node:lts

ARG SERVER="/backend-adonis"
ARG SERVER_src="."
ARG BUILD="/backend-adonis/build"
ENV PORTS="3333"

WORKDIR ${SERVER}

EXPOSE ${PORTS}

COPY ${SERVER_src} ${SERVER}

RUN node ace build --production

WORKDIR ${BUILD}

RUN npm ci --production

CMD ["node", "server.js"]
