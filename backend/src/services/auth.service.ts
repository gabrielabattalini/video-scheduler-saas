import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { jwtConfig } from '../config/jwt.config';
import type { RegisterInput, LoginInput } from '../schemas/auth.schema';

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static generateAccessToken(userId: string, email: string): string {
    return jwt.sign(
      { userId, email },
      jwtConfig.accessTokenSecret,
      { expiresIn: jwtConfig.accessTokenExpiry }
    );
  }

  static generateRefreshToken(userId: string): string {
    return jwt.sign(
      { userId },
      jwtConfig.refreshTokenSecret,
      { expiresIn: jwtConfig.refreshTokenExpiry }
    );
  }

  static verifyAccessToken(token: string): { userId: string; email: string } | null {
    try {
      const decoded = jwt.verify(token, jwtConfig.accessTokenSecret) as any;
      return { userId: decoded.userId, email: decoded.email };
    } catch (error) {
      return null;
    }
  }

  static verifyRefreshToken(token: string): { userId: string } | null {
    try {
      const decoded = jwt.verify(token, jwtConfig.refreshTokenSecret) as any;
      return { userId: decoded.userId };
    } catch (error) {
      return null;
    }
  }

  static async register(data: RegisterInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error('Email já cadastrado');
    }

    const hashedPassword = await this.hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        provider: 'email',
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    const accessToken = this.generateAccessToken(user.id, user.email);
    const refreshToken = this.generateRefreshToken(user.id);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  static async login(data: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new Error('Credenciais inválidas');
    }

    // Se usuário não tem senha (OAuth), não pode fazer login com email/senha
    if (!user.password) {
      throw new Error('Esta conta usa login social. Use Google para fazer login.');
    }

    const isPasswordValid = await this.comparePassword(data.password, user.password);

    if (!isPasswordValid) {
      throw new Error('Credenciais inválidas');
    }

    const accessToken = this.generateAccessToken(user.id, user.email);
    const refreshToken = this.generateRefreshToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
      },
      accessToken,
      refreshToken,
    };
  }

  static async refreshAccessToken(refreshToken: string) {
    const decoded = this.verifyRefreshToken(refreshToken);

    if (!decoded) {
      throw new Error('Refresh token inválido');
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true },
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const newAccessToken = this.generateAccessToken(user.id, user.email);

    return { accessToken: newAccessToken };
  }
}