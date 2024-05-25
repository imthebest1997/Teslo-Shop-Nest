import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function main() {

  const app = await NestFactory.create(AppModule);

  // Listen on port 3000
  await app.listen(3000);

  // Global prefix
  app.setGlobalPrefix('api');
}

main();
