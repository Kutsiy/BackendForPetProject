import { Token, TokenDocumentType } from '@app/common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectModel(Token.name)
    private readonly tokenModel: Model<TokenDocumentType>,
  ) {}

  generateToken(payload) {
    const accessJwtSecret = this.configService.get<string>('ACCESS_JWT_SECRET');

    const refreshJwtSecret =
      this.configService.get<string>('REFRESH_JWT_SECRET');

    if (!accessJwtSecret || !refreshJwtSecret) {
      throw new RpcException('JWT secret not defined in environment');
    }
    const accessToken = this.jwtService.sign(payload, {
      secret: accessJwtSecret,
      expiresIn: '60s',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: refreshJwtSecret,
      expiresIn: '2w',
    });
    return { accessToken, refreshToken };
  }

  async saveRefreshToken(refreshToken: string, userId: Types.ObjectId) {
    const token = await this.tokenModel.findOne({ userId }).exec();
    if (token) {
      token.refreshToken = refreshToken;
      await token.save();
    } else {
      await this.tokenModel.create({ userId: userId, refreshToken });
    }
  }
}
