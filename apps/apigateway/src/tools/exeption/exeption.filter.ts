import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { GraphQLError } from 'graphql';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const message =
      exception.details ||
      (exception.response && exception.response.message.join('. ')) ||
      exception.message ||
      'Internal server error';
    return new GraphQLError(message);
  }
}
