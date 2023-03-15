# Docker file for building and hosting the Commerce management app.
# The app is accessible at port 80.
#
# Build with
#   docker build --force-rm -t managementapp .
#
# Run with
#   docker run -d -p 8000:80/tcp --name management-app managementapp:latest
#
# Enjoy!

FROM nginx:1.19 AS base

FROM node:14.17 AS build
ARG REACT_APP_COMMERCE_API_BASE
ARG REACT_APP_IDENTITY_API_BASE
ARG REACT_APP_BASE
ARG REACT_APP_LOGLEVEL
WORKDIR /app
COPY . .
RUN npm install -g npm@8.1
RUN npm install
RUN npm run build

FROM base AS final
COPY --from=build /app/build /usr/share/nginx/html
COPY config/nginx/default.conf /etc/nginx/conf.d
