import { DocumentType } from '@typegoose/typegoose';
import { Request, Response } from 'express';
import { get } from 'lodash';
import { User } from '../models/user.model';
import { CreateSessionInput } from '../schema/auth.schema';
import {
    findSessionById,
    signAccessToken,
    singRefreshToken,
    createSession,
} from '../service/auth.service';

import { findUserByEmail, findUserById } from '../service/user.service';

import { signJwt, verifyJwt } from '../utils/jwt.utils';

export const createSessionHandler = async (
    req: Request<{}, {}, CreateSessionInput>,
    res: Response
) => {
    const message = 'Invalid email or password';
    const { email, password } = req.body;
    console.log(req.body);
    const user = await findUserByEmail(email);
    if (!user) {
        return res.send(message);
    }
    if (!user.verified) {
        return res.send('Pleaser verify your email');
    }

    const isValid = await user.validatePassword(password);
    if (!isValid) {
        return res.send(message);
    }

    // create a session
    const session = await createSession(user._id);

    // create an access token

    const accessToken = signJwt(
        { ...user, session: session._id },
        'accessTokenPrivateKey',
        { expiresIn: '15m' } // 15 minutes
    );

    // create a refresh token
    const refreshToken = signJwt(
        { ...user, session: session._id },
        'refreshTokenPrivateKey',
        { expiresIn: '30d' } // 15 minutes
    );

    res.cookie('access_token', accessToken, {
        maxAge: 900000,
        httpOnly: true,
        domain: 'localhost',
        path: '/',
        sameSite: 'strict',
        secure: false,
    });

    res.cookie('refresh_token', refreshToken, {
        maxAge: 900000,
        httpOnly: true,
        domain: 'localhost',
        path: '/',
        sameSite: 'strict',
        secure: false,
    });
    console.log(refreshToken);
    return res.status(201).json({
        accessToken,
        refreshToken,
    });
};

export const refreshSessionHandler = async (req: Request, res: Response) => {
    const refreshToken = get(req, 'headers.x-refresh');

    const { decoded } = verifyJwt(refreshToken, 'refreshTokenPublicKey');
    if (!decoded) {
        return res.status(401).send('Could not refresh access token');
    }
    const session = await findSessionById(get(decoded, 'session'));
    if (!session || !session.valid) {
        return res.status(401).send('Could not refresh access token');
    }
    const user = await findUserById(String(session.user));
    if (!user) {
        return res.status(401).send('Could not refresh access token');
    }
    const accessToken = signAccessToken(user);
    return res.send({ accessToken });
};
