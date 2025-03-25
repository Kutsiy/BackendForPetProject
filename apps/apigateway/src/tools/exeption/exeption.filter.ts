import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    const ctx = gqlHost.getContext();
    const response = ctx.res;

    if (exception?.extensions?.http?.status) {
      response.status(exception.extensions.http.status);
    }

    const message =
      exception.details ||
      (exception.response && exception.response.message.join('. ')) ||
      exception.message ||
      'Internal server error';
    return new GraphQLError(message, {
      extensions: exception.extensions,
    });
  }
}
