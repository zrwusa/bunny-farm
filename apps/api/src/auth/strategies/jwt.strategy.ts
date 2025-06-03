import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import { JwtPayload } from '../types/types';
import { Request } from 'express';

// Use it when a request for user authentication is required. Every time the backend is requested, the token will be verified.
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly logger = new Logger(JwtStrategy.name);
  constructor(config: ConfigService) {
    const secret = config.get('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }
    super({
      jwtFromRequest: function (req: Request): string | null {
        const authHeader = req.headers['authorization'];
        console.debug('---req.cookies', req.cookies);
        if (authHeader?.startsWith('Bearer ')) {
          console.debug('---from header');
          return authHeader.slice(7);
        }
        if (req.cookies?.access_token) {
          console.debug('---from cookie');
          return req.cookies.access_token;
        }
        return null;
      },
      secretOrKey: secret,
      passReqToCallback: false, // If you don't need to get req, you can keep false
    });
  }

  async validate(payload: JwtPayload) {
    this.logger.debug(`Validating JWT payload for user: ${payload.sub}`);
    return { id: payload.sub, email: payload.email };
  }
}
