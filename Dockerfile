FROM node:14-alpine as base
WORKDIR /usr/app
RUN apk update && apk add bash
SHELL ["/bin/bash", "-c"]

FROM base as dependencies
COPY package.json .
COPY yarn.lock .
RUN yarn install --frozen-lockfile
COPY ./src ./src
COPY ./tsconfig.json .
COPY ./tsconfig.build.json .
COPY ./nest-cli.json .
COPY ./.env .
RUN yarn run build

FROM base as build
COPY --from=dependencies /usr/app/dist/ ./dist/
COPY --from=dependencies /usr/app/node_modules/ ./node_modules/
COPY --from=dependencies /usr/app/package.json ./
COPY ./.env .

CMD ["node", "dist/main"]
