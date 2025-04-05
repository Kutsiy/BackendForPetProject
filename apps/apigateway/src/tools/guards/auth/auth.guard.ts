import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { GraphQLError } from 'graphql';

@Injectable({})
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const accessJwtSecret = this.configService.get<string>('ACCESS_JWT_SECRET');
    const refreshJwtSecret =
      this.configService.get<string>('REFRESH_JWT_SECRET');
    if (!accessJwtSecret || !refreshJwtSecret) {
      throw new RpcException('JWT secret not defined in environment');
    }
    const graphQlContext = GqlExecutionContext.create(context);
    const request = graphQlContext.getContext().req;
    const accessToken = request.cookies?.access_token;
    const refreshToken = request.cookies?.refresh_token;
    if (!refreshToken) return false;
    if (!accessToken) {
      throw new GraphQLError('You are not authorized', {
        extensions: {
          code: 'UNAUTHORIZED',
          http: {
            status: 401,
          },
        },
      });
    }
    try {
      const payload = await this.jwtService.verifyAsync(accessToken, {
        secret: accessJwtSecret,
      });
      await this.jwtService.verifyAsync(refreshToken, {
        secret: refreshJwtSecret,
      });
      request.user = payload;
      return true;
    } catch (error) {
      throw new GraphQLError('Error signing', {
        extensions: {
          code: 'Error signing',
          http: {
            status: 401,
          },
        },
      });
    }
  }

  // private extractTokenFromHeader(request: Request): string | undefined {
  //   const token = request.headers.authorization;

  //   if (!token) return undefined;

  //   const [type, splitToken] = token.split(' ');
  //   return type === 'Bearer' ? splitToken : undefined;
  // }
}
