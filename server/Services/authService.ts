import express from 'express';
import jsonwebtoken, { VerifyErrors } from 'jsonwebtoken';
import env from '../Config/env';
import UserToken from '../Models/UserToken';

export function authenticateToken(
    req: express.Request,
    res: express.Response,
    next: Function
) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return res.sendStatus(401);
    }
    jsonwebtoken.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET!,
        (err: VerifyErrors | null, user: any) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        }
    );
}

export function generateAccessToken(userToken: UserToken) {
    return jsonwebtoken.sign(userToken, env.accessTokenSecret, {
        expiresIn: '15m',
    });
}

export function generateRefreshToken(userToken: UserToken) {
    return jsonwebtoken.sign(userToken, env.refreshTokenSecret);
}
