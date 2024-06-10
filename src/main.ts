import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function main() {

  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Main');

  // Global prefix
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      // transform: true,
      forbidNonWhitelisted: true,
    })
  );

  const config = new DocumentBuilder()
    .setTitle('Teslo RESTFul API')
    .setDescription('Teslo API description')
    .setVersion('1.0')
    .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

  // Listen on port 3000
  await app.listen( process.env.PORT );  
  logger.log(`Server running on port ${ process.env.PORT }`);
}

main();
