import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  generateToken(payload) {
    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new RpcException('JWT secret not defined in environment');
    }
    const accessToken = this.jwtService.sign(payload, {
      secret: jwtSecret,
      expiresIn: '60s',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: jwtSecret,
      expiresIn: '2w',
    });
    return { accessToken, refreshToken };
  }
}
