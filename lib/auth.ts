import {Request} from "express";
import {Strategy, VerifiedCallback} from "passport-jwt";
import BaseError from '@etianen/base-error';
import {config} from './config';

class UnauthorizedError extends BaseError {
  statusCode = 401;
}

export function jwtStrategy(): any {
  const {issuer, secret, cookieKey, csrfHeaderKey} = config.jwt;
  return new Strategy({
    issuer,
    secretOrKey: secret,
    passReqToCallback: true,
    jwtFromRequest: (req: Request) => req.cookies[cookieKey],
  }, (req: Request, payload: any, done: VerifiedCallback) => {
    const csrfHeaderToken = req.headers[csrfHeaderKey];
    if (payload.csrfToken === csrfHeaderToken) {
      done(null, payload);
    } else {
      done(new UnauthorizedError(`CSRF Token mismatch`));
    }
  });
}

