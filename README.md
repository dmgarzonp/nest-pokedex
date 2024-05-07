<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

#Ejecutar en desarrollo 

1. Clonar repositorio
2. Ejecutar el comando de :

```
yarn install
```

3. Tener instalado Nest CLI

```
npm i -g @nestjs/cli
```

4. Lebamntar la base de datos

```
docker-compose up -d
```

5. Clonar el Archivo __.env.template__ y renombrar la copia a __.env__

6. LLenar las variables de entorno en el ```.env```

7. Ejecutar la aplicacion dev con 
```
yarn start:dev
```

8. Reconstrur la base de datoas a partir de nuestra semilla Seed

```
http://localhost:3000/api/v2/seed
```

# Stack usado
* Mongo DB
* Nestjs
