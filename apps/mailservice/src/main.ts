import { NestFactory } from '@nestjs/core';
import { MailserviceModule } from './mailservice.module';

async function bootstrap() {
  const app = await NestFactory.create(MailserviceModule);
  await app.listen(3000);
}
bootstrap();
