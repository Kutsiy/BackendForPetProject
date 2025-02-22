import { Token, TokenDocumentType, User, UserDocumentType } from '@app/common';
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
    const { id }: Payload = this.jwtService.decode(refreshTokenFromUser);
    const userIdObject = new Types.ObjectId(id);
    const {
      email,
      roles: ObjectIdRoles,
      isActivated,
    } = await this.userModel.findById(userIdObject).populate('roles').exec();
    const roles = ObjectIdRoles.map((ur: any) => ur.roleId.name);
    const { accessToken, refreshToken } = this.generateToken({
      id,
      email,
      roles,
      isActivated,
    });
    await this.saveRefreshToken(refreshToken, userIdObject);
    return {
      accessToken,
      refreshToken,
      user: { id: `${id}`, email, isActivated },
    };
  }
}
