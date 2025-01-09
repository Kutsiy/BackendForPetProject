import { NestFactory } from '@nestjs/core';
import { AuthserviceModule } from './authservice.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { auth } from '@app/common';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthserviceModule,
    {
      transport: Transport.GRPC,
      options: {
        package: auth.protobufPackage,
        protoPath: join(__dirname, '../auth.proto'),
        // url: '0.0.0.0:5000',
        url: 'localhost:5001',
      },
    },
  );
  await app.listen();
}
bootstrap();
