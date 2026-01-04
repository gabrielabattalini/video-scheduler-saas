import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

// Estender Request do Express
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
      };
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Pegar token do header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    // Formato: Bearer TOKEN
    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ error: 'Formato de token inválido' });
    }

    const token = parts[1];

    // Verificar token
    const decoded = AuthService.verifyAccessToken(token);

    if (!decoded) {
      return res.status(401).json({ error: 'Token inválido ou expirado' });
    }

    // Adicionar usuário ao request
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Erro na autenticação' });
  }
};
