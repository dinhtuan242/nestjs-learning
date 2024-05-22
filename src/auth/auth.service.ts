import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2';
import { AuthDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(authDto: AuthDto) {
    const existingUser = await this.prismaService.user.findUnique({
      where: { email: authDto.email },
    });

    if (existingUser) {
      throw new ForbiddenException('Email already exists');
    }
    const hashedPassword = await argon.hash(authDto.password);
    try {
      return this.prismaService.user.create({
        data: {
          email: authDto.email,
          password: hashedPassword,
          firstName: authDto.firstName ?? '',
          lastName: authDto.lastName ?? '',
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          createdAt: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ForbiddenException('Email already exists');
      }
      throw error;
    }
  }

  async login(authDto: AuthDto) {
    const existingUser = await this.prismaService.user.findUnique({
      select: {
        id: true,
        email: true,
        password: true,
        firstName: true,
        lastName: true,
        createdAt: true,
      },
      where: { email: authDto.email },
    });
    if (!existingUser) {
      throw new ForbiddenException('User not found');
    }
    delete existingUser.password;
    return await this.signJwtToken(existingUser.id, existingUser.email);
  }

  async signJwtToken(
    userId: number,
    email: string,
  ): Promise<{ accessToken: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const jwtToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
      secret: this.configService.get('JWT_SECRET'),
    });
    return {
      accessToken: jwtToken,
    };
  }
}
