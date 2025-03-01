import { Token, TokenDocumentType, User, UserDocumentType } from '@app/common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  JsonWebTokenError,
  JwtService,
  NotBeforeError,
  TokenExpiredError,
} from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

export interface Payload {
  id: Types.ObjectId;
  email: string;
  roles: string[];
  isActivated: boolean;
}
@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectModel(Token.name)
    private readonly tokenModel: Model<TokenDocumentType>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocumentType>,
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
      await this.jwtService.verifyAsync(token, {
        secret: refreshJwtSecret,
      });
      const tokenFromDb = await this.tokenModel
        .findOne({ refreshToken: token })
        .exec();
      if (!tokenFromDb || !tokenFromDb.refreshToken) {
        throw new RpcException('TOKEN NOT FOUND');
      }
      return true;
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new RpcException('Refresh token has expired');
      } else if (e instanceof JsonWebTokenError) {
        throw new RpcException('Invalid refresh token');
      } else if (e instanceof NotBeforeError) {
        throw new RpcException('Token is not active yet');
      } else {
        throw new RpcException(e);
      }
    }
  }

  async generateToken(payload: Payload) {
    const { accessJwtSecret, refreshJwtSecret } = this.findSecret();

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: accessJwtSecret,
      expiresIn: '15m',
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: refreshJwtSecret,
      expiresIn: '7d',
    });
    return { accessToken, refreshToken };
  }

  async saveRefreshToken(refreshToken: string, userId: Types.ObjectId) {
    // const token = await this.tokenModel.findOne({ userId }).exec();
    // if (token) {
    //   token.refreshToken = refreshToken;
    //   await token.save();
    // } else {
    //   await this.tokenModel.create({ userId: userId, refreshToken });
    // }
    await this.tokenModel
      .findOneAndUpdate(
        { userId },
        { refreshToken },
        { upsert: true, new: true, returnDocument: 'after' },
      )
      .exec();
  }

  async refreshToken(refreshTokenFromUser: string) {
    try {
      const isValid = await this.validateRefreshToken(refreshTokenFromUser);
      if (!isValid) {
        throw new RpcException('Invalid refresh token');
      }
      const { id }: Payload = this.jwtService.decode(refreshTokenFromUser);
      const userIdObject = new Types.ObjectId(id);
      const {
        email,
        roles: ObjectIdRoles,
        isActivated,
      } = await this.userModel.findById(userIdObject).populate('roles').exec();
      const roles = ObjectIdRoles.map((ur: any) => ur.roleId.name);
      const { accessToken, refreshToken } = await this.generateToken({
        id,
        email,
        roles,
        isActivated,
      });
      if (!accessToken || !refreshToken) {
        throw new RpcException('Access and refresh tokens not allowed');
      }
      await this.saveRefreshToken(refreshToken, userIdObject);
      return {
        accessToken,
        refreshToken,
        user: { id: `${id}`, email, isActivated },
      };
    } catch (err) {
      console.log(err, 'ERROR FROM REFRESH_TOKEN');
      throw new RpcException(err.message || 'Failed to refresh token');
    }
  }

  async getUserByToken(refreshToken: string) {
    const isValid = await this.validateRefreshToken(refreshToken);
    if (!isValid) {
      throw new RpcException('Invalid refresh token');
    }
    return this.jwtService.decode(refreshToken);
  }
}
