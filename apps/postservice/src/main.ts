import { NestFactory } from '@nestjs/core';
import { PostserviceModule } from './postservice.module';

async function bootstrap() {
  const app = await NestFactory.create(PostserviceModule);
  await app.listen(3001);
}
bootstrap();
