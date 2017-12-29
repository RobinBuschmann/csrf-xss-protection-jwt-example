import * as express from "express";
import * as passport from "passport";
import * as cookieParser from "cookie-parser";
import * as errorhandler from 'strong-error-handler';
import * as jwt from 'jsonwebtoken';
import {randomBytes} from 'crypto';
import * as path from 'path';
import {config} from './config';
import {jwtStrategy} from './auth';

const {environment, jwt: {secret, issuer, expiresIn, cookieKey}} = config;
const getJwtToken = payload => jwt.sign(payload, secret, {issuer, expiresIn});
const getCsrfToken = () => randomBytes(16).toString('hex');

passport.use(jwtStrategy());

export const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

app.get('/token', (req, res) => {
  const csrfToken = getCsrfToken();
  const payload = {csrfToken};
  const jwtToken = getJwtToken(payload);

  res.cookie(cookieKey, jwtToken, {httpOnly: true, secure: environment === 'prod'});
  res.json(payload);
});

app.use(passport.authenticate(['jwt'], {session: false}));

app.get('/test', (req, res) => res.send(`you're authenticated!`));

app.use(errorhandler({debug: environment !== 'prod', log: true}));
