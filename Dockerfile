FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM httpd:2.4-alpine

COPY --from=build /app/dist/ /usr/local/apache2/htdocs/

EXPOSE 80

CMD ["httpd-foreground"]
