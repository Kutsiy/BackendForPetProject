import { Role, RoleDocumentType, Token, TokenDocumentType } from '@app/common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class RoleService {
  constructor(
    private readonly configService: ConfigService,
    @InjectModel(Role.name) private readonly roleModel: Model<RoleDocumentType>,
  ) {}

  async createRole(name: string, description: string) {
    await this.roleModel.create({ name, description });
  }

  async getRoleIdByName(name: string) {
    const role = await this.roleModel.findOne({ name }).exec();
    if (!role) {
      throw new Error(`Role with name "${name}" not found`);
    }
    return role;
  }
}
