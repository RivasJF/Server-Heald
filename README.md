<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>


  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

## Description

Un proyecto Backend para administracion de citas medicas.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run migration prisma

```bash
# migrate model database
$ npx prisma migrate dev --name <migration_name>
```
## Run docker

```bash
# run build and conteiner
$ docker-compose up -d --build

# destroy conteiners and netword
$ docker-compose down
```
## License

Nest is MIT licensed.
