import { DocumentType } from '@typegoose/typegoose';
import SessionModel, { Session } from '../models/session.model';
import { privateFields, User } from '../models/user.model';
import { omit } from 'lodash';
import log from '../utils/logger';
import { get } from 'lodash';
import { findUserById } from './user.service';
import { signJwt, verifyJwt } from '../utils/jwt.utils';

export const createSession = async ({ userId }: { userId: string }) => {
    const session = await SessionModel.create({ user: userId });
    return session.toJSON();
};

export const findSessionById = async (id: string) => {
    return SessionModel.findById(id);
};

export const singRefreshToken = async ({ userId }: { userId: string }) => {
    const session = await createSession({ userId });

    const refreshToken = signJwt(
        { session: session._id },
        'refreshTokenPrivateKey',
        {
            expiresIn: '30d',
        }
    );

    return refreshToken;
};

export const signAccessToken = (user: DocumentType<User>) => {
    const payload = omit(user.toJSON(), privateFields);

    const accessToken = signJwt(payload, 'accessTokenPrivateKey', {
        expiresIn: '15m',
    });
    return accessToken;
};

export const reIssueAccessToken = async ({
    refreshToken,
}: {
    refreshToken: string;
}) => {
    const { decoded } = verifyJwt(refreshToken, 'refreshTokenPublicKey');
    if (!decoded || get(decoded, 'session')) return false;
    const session = await SessionModel.findById(get(decoded, 'session'));

    if (!session || !session.valid) return false;

    const user = await findUserById(String(session.user));
    if (!user) return false;

    const accessToken = signJwt(
        { ...user, session: session._id },
        'accessTokenPrivateKey',
        { expiresIn: '15m' }
    );
    return accessToken;
};
