import { NestFactory } from '@nestjs/core';
import { PostserviceModule } from './postservice.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { protobufPackage } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    PostserviceModule,
    {
      transport: Transport.GRPC,
      options: {
        package: protobufPackage,
        protoPath: join(__dirname, '../post.proto'),
        // url: '0.0.0.0:5000',
        url: 'localhost:5000',
      },
    },
  );
  await app.listen();
}
bootstrap();
