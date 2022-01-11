import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../utils/jwt.utils';
import { get } from 'lodash';
import { reIssueAccessToken } from '../service/auth.service';

const deserializeUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const accessToken =
        get(req, 'cookies.access_token') ||
        (req.headers.authorization || '').replace(/^Bearer\s/, '');

    const refreshToken =
        get(req, 'cookies.refresh_token') || get(req, 'headers.x-refresh');

    if (!accessToken) {
        return next();
    }
    const { decoded, expired } = verifyJwt(accessToken, 'accessTokenPublicKey');
    if (decoded) {
        res.locals.user = decoded;
        next();
    }
    if (expired && refreshToken) {
        const newAccessToken = await reIssueAccessToken(refreshToken);
        if (newAccessToken) {
            res.setHeader('X-access-token', newAccessToken);
            res.cookie('accessToken', newAccessToken, {
                maxAge: 900000, // 15 mins
                httpOnly: true,
                domain: 'localhost',
                path: '/',
                sameSite: 'strict',
                secure: false,
            });
        }
    }
    return next();
};

export default deserializeUser;
