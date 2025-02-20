import { Token, TokenDocumentType } from '@app/common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

interface Payload {
  id: Types.ObjectId;
  email: string;
  roles: string[];
}
@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectModel(Token.name)
    private readonly tokenModel: Model<TokenDocumentType>,
  ) {}

  findSecret() {
    const accessJwtSecret = this.configService.get<string>('ACCESS_JWT_SECRET');
    const refreshJwtSecret =
      this.configService.get<string>('REFRESH_JWT_SECRET');
    if (!accessJwtSecret || !refreshJwtSecret) {
      throw new RpcException('JWT secret not defined in environment');
    }
    return { accessJwtSecret, refreshJwtSecret };
  }

  validateAccessToken(token: string) {
    const { accessJwtSecret } = this.findSecret();

    try {
      this.jwtService.verify(token, { secret: accessJwtSecret });
      return true;
    } catch (e) {
      return false;
    }
  }

  async validateRefreshToken(token: string) {
    const { refreshJwtSecret } = this.findSecret();

    try {
      this.jwtService.verify(token, { secret: refreshJwtSecret });
      const tokenFromDb = await this.tokenModel
        .findOne({ refreshToken: token })
        .exec();
      if (!tokenFromDb) {
        throw new RpcException('Refresh token not found');
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  generateToken(payload: Payload) {
    const { accessJwtSecret, refreshJwtSecret } = this.findSecret();

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

  async refreshToken(refreshTokenFromUser: string) {
    const isValid = await this.validateRefreshToken(refreshTokenFromUser);
    if (!isValid) {
      throw new RpcException('Invalid refresh token');
    }
    const { id, email, roles }: Payload =
      this.jwtService.decode(refreshTokenFromUser);
    const { accessToken, refreshToken } = this.generateToken({
      id,
      email,
      roles,
    });
    const userIdObject = new Types.ObjectId(id);
    await this.saveRefreshToken(refreshToken, userIdObject);
    return { accessToken, refreshToken };
  }
}
