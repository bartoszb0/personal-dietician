import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { AUTH_COOKIE_NAME, JWT_SECRET } from '../auth.constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: (req: Request) => req?.cookies?.[AUTH_COOKIE_NAME] ?? null,
      secretOrKey: JWT_SECRET,
    });
  }

  validate(payload: { sub: string; email: string }) {
    return { id: payload.sub, email: payload.email };
  }
}
