import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { PostResolver } from './post/post.resolver';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { protobufPackage } from '@app/common';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(
        process.cwd(),
        'apps/apigateway/src/schemas/schema.gql',
      ),
      // playground: true,
    }),
    ClientsModule.register([
      {
        name: 'POST_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: protobufPackage,
          protoPath: join(__dirname, '../post.proto'),
          url: 'post-service:5000',
        },
      },
    ]),
  ],
  controllers: [],
  providers: [AppService, PostResolver],
})
export class AppModule {}
