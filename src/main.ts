import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Se anota el Global Prefix para las rutas Ejemplo api/

  app.setGlobalPrefix('api/v2');


  //Validacion global para los PIPES
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true
    
      }
    })
  );


  //Los globals Pipes
  await app.listen(process.env.PORT);
  console.log(`App running ${process.env.PORT}`);
  
}
bootstrap();
