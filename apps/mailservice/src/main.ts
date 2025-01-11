import { NestFactory } from '@nestjs/core';
import { MailserviceModule } from './mailservice.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { protobufPackage } from '@app/common/types/protos/mail';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MailserviceModule,
    {
      transport: Transport.GRPC,
      options: {
        package: protobufPackage,
        protoPath: join(__dirname, '../mail.proto'),
        // url: '0.0.0.0:5000',
        url: 'localhost:5002',
      },
    },
  );
  await app.listen();
}
bootstrap();
