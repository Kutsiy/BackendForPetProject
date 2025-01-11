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
import { protobufPackage as mailProtobufPackage } from '@app/common/types/protos/mail';
import { protobufPackage as authProtobufPackage } from '@app/common/types/protos/auth';
import { MailService } from './mail/mail.service';
import { MailController } from './mail/mail.controller';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(
        process.cwd(),
        'apps/apigateway/src/tools/schemas/schema.gql',
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
          package: authProtobufPackage,
          protoPath: join(__dirname, '../auth.proto'),
          // url: 'post-service:5000',
          url: 'localhost:5001',
        },
      },
      {
        name: 'MAIL_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: mailProtobufPackage,
          protoPath: join(__dirname, '../mail.proto'),
          // url: 'post-service:5000',
          url: 'localhost:5002',
        },
      },
    ]),
  ],
  controllers: [MailController],
  providers: [
    PostService,
    PostResolver,
    AuthResolver,
    AuthService,
    MailService,
  ],
})
export class AppModule {}
