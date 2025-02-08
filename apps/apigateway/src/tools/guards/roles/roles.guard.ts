import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesSetter } from './roles.guard-setter';
import { GqlExecutionContext } from '@nestjs/graphql';
import { RpcException } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable({})
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles: string[] = this.reflector.get('roles', context.getHandler());
    const accessJwtSecret = this.configService.get<string>('ACCESS_JWT_SECRET');
    if (!accessJwtSecret) {
      throw new RpcException('JWT secret not defined in environment');
    }
    if (!roles) {
      return true;
    }
    const graphQlContext = GqlExecutionContext.create(context);
    const request = graphQlContext.getContext().req;
    const token = request.headers.authorization;
    if (!token) {
      throw new RpcException('You are not authorized');
    }
    const [type, splitToken] = token.split(' ');
    const decodedToken = this.jwtService.verify(splitToken, {
      secret: accessJwtSecret,
    });
    const decodedUserRoles: string[] = decodedToken.roles;
    return decodedUserRoles.every((role) => roles.includes(role));
  }
}
