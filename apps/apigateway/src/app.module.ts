import { Module } from '@nestjs/common';
import { PostService } from './post/post.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { PostResolver } from './post/post.resolver';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { auth, protobufPackage } from '@app/common';
import { AuthResolver } from './auth/auth.resolver';
import { AuthService } from './auth/auth.service';
import { GraphQLError, GraphQLFormattedError } from 'graphql';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(
        process.cwd(),
        'apps/apigateway/src/schemas/schema.gql',
      ),
      playground: {
        settings: {
          'request.credentials': 'include',
        },
      },
      formatError: (error: GraphQLError) => {
        const graphQLFormattedError: GraphQLFormattedError = {
          message: error.message,
        };
        return graphQLFormattedError;
      },
      context: ({ req, res }) => ({ req, res }),
    }),
    ClientsModule.register([
      {
        name: 'POST_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: protobufPackage,
          protoPath: join(__dirname, '../post.proto'),
          // url: 'post-service:5000',
          url: 'localhost:5000',
        },
      },
      {
        name: 'AUTH_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: auth.protobufPackage,
          protoPath: join(__dirname, '../auth.proto'),
          // url: 'post-service:5000',
          url: 'localhost:5001',
        },
      },
    ]),
  ],
  controllers: [],
  providers: [PostService, PostResolver, AuthResolver, AuthService],
})
export class AppModule {}
