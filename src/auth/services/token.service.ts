import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { generateJWT } from '../interfaces/generateJWT';
import {
  DecodedTokenInfo,
  PayloadToken,
  TokenI,
  TokenInfo,
} from '../interfaces/token';
import { DeleteResult, Repository } from 'typeorm';
import { Token } from '../entities/token.entity';
import { ErrorManager } from 'src/utils/error.manager';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginAdminATResDTO } from '../interfaces/info';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    private readonly configService: ConfigService,
  ) {}

  async saveRefreshToken(token: TokenI): Promise<TokenI> {
    try {
      const rToken: Token = await this.tokenRepository.save(token);
      if (!rToken) {
        throw new ErrorManager({
          type: 'INTERNAL_SERVER_ERROR',
          message: 'No se pudo crear el token',
        });
      }
      return { token: rToken.token };
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async getTokenDB(token: string): Promise<Token> {
    try {
      const tokenDB: Token = await this.tokenRepository.findOneBy({
        token: token,
      });
      if (!tokenDB) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'Token no encontrado',
        });
      }
      return tokenDB;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async deleteToken(id: string): Promise<DeleteResult | undefined> {
    try {
      const token: DeleteResult = await this.tokenRepository.delete(id);
      if (token.affected === 0) {
        throw new ErrorManager({
          type: 'INTERNAL_SERVER_ERROR',
          message: 'No se puedo borrar',
        });
      }
      return token;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  generateAccessToken(employee: LoginAdminATResDTO) {
    return this.generateJWT({
      employee: employee,
      isAccessToken: true,
      expires: 1200,
    });
  }

  generateRefreshToken(employee: LoginAdminATResDTO) {
    return this.generateJWT({
      employee: employee,
      isAccessToken: false,
      expires: 28800,
    });
  }

  generateJWT({ employee, isAccessToken, expires }: generateJWT): TokenI {
    const payload: PayloadToken = {
      role: employee.role,
      sub: employee.id,
    };
    const secret = isAccessToken
      ? this.configService.get('JWT_ACCESS_SECRET')
      : this.configService.get('JWT_REFRESH_SECRET');
    return {
      token: this.signJWT({
        payload,
        secret: secret,
        expires: expires,
      }),
    };
  }

  signJWT({
    payload,
    secret,
    expires,
  }: {
    payload: jwt.JwtPayload;
    secret: string;
    expires: number | string;
  }): string {
    return jwt.sign(payload, secret, { expiresIn: expires });
  }

  tokenInfo(token: string): TokenInfo {
    const decode = jwt.decode(token) as DecodedTokenInfo;

    return {
      sub: decode.sub,
      role: decode.role,
    };
  }

  verifyAccessToken(token: string): TokenInfo | string {
    try {
      const verify = jwt.verify(
        token,
        this.configService.get('JWT_ACCESS_SECRET'),
      ) as DecodedTokenInfo;
      return { sub: verify.sub, role: verify.role };
    } catch (error) {
      return error.message;
    }
  }

  verifyRefreshToken(token: string): TokenInfo | string {
    try {
      const verify = jwt.verify(
        token,
        this.configService.get('JWT_REFRESH_SECRET'),
      ) as DecodedTokenInfo;
      return { sub: verify.sub, role: verify.role };
    } catch (error) {
      return error.message;
    }
  }
}
