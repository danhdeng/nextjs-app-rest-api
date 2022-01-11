import jwt from 'jsonwebtoken';
import config from 'config';
import log from './logger';

type Token = {
    valid: boolean;
    expired: boolean;
    decode: string | jwt.JwtPayload;
};

export const signJwt = (
    object: Object,
    keyName: 'accessTokenPrivateKey' | 'refreshTokenPrivateKey',
    options?: jwt.SignOptions | undefined
) => {
    const signingKey = Buffer.from(
        config.get<string>(keyName),
        'base64'
    ).toString('ascii');

    return jwt.sign(object, signingKey, {
        ...(options && options),
        algorithm: 'RS256',
    });
};

export function verifyJwt(
    token: string,
    keyName: 'accessTokenPublicKey' | 'refreshTokenPublicKey'
) {
    const publicKey = Buffer.from(
        config.get<string>(keyName),
        'base64'
    ).toString('ascii');
    try {
        const decoded = jwt.verify(token, publicKey);
        return {
            valid: true,
            expired: false,
            decoded,
        };
    } catch (error: any) {
        log.error(error);
        return {
            valid: false,
            expired: error.message === 'jwt expired',
            decoded: null,
        };
    }
}
