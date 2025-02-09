import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { Request } from 'express';

@Injectable({})
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const accessJwtSecret = this.configService.get<string>('ACCESS_JWT_SECRET');
    if (!accessJwtSecret) {
      throw new RpcException('JWT secret not defined in environment');
    }
    const graphQlContext = GqlExecutionContext.create(context);
    const request = graphQlContext.getContext().req;
    const token = request.cookies?.access_token;
    if (!token) {
      throw new RpcException('You are not authorized');
    }
    try {
      const payload = await this.jwtService.signAsync(token, {
        secret: accessJwtSecret,
      });
      request.user = payload;
    } catch (error) {
      throw new RpcException('Error signing');
    }
    return true;
  }

  // private extractTokenFromHeader(request: Request): string | undefined {
  //   const token = request.headers.authorization;

  //   if (!token) return undefined;

  //   const [type, splitToken] = token.split(' ');
  //   return type === 'Bearer' ? splitToken : undefined;
  // }
}
