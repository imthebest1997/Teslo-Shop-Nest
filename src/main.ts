import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

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


  // Listen on port 3000
  await app.listen( process.env.PORT );  
  logger.log(`Server running on port ${ process.env.PORT }`);
}

main();
