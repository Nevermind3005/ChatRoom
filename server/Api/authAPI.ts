import express, { Router } from 'express';
import bcrypt from 'bcrypt';
import User from '../Models/User';
import UserToken from '../Models/UserToken';
import jsonwebtoken from 'jsonwebtoken';
import db, { insertUser } from '../db';
import {
    generateAccessToken,
    generateRefreshToken,
} from '../Services/authService';
let refreshTokens = new Array();

const router: Router = express.Router();

router.post('/auth/signup', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user: User = {
            username: req.body.username,
            password: hashedPassword,
            email: req.body.email,
        };
        db.run(insertUser, [user.username, user.password, user.email]);

        res.status(201).send();
    } catch {
        res.status(500).send();
    }
});

router.post('/auth/login', async (req, res) => {
    const email = req.body.email;
    db.get('select * from users where email = ?;', email, async (_, row) => {
        if (row == null) {
            return res.sendStatus(404);
        }
        const user: User = {
            username: row.username,
            password: row.password,
            email: row.email,
        };
        try {
            if (await bcrypt.compare(req.body.password, user.password)) {
                const userToken: UserToken = {
                    username: user.username,
                    email: user.email,
                };
                const accessToken = generateAccessToken(userToken);
                const refreshToken = generateRefreshToken(userToken);
                refreshTokens.push(refreshToken);
                res.json({
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                });
                res.send('Success');
            } else {
                res.send('Now allowed');
            }
        } catch {
            res.status(500).send();
        }
    });
});

router.post('/auth/token', (req, res) => {
    const refreshToken = req.body.token;
    if (refreshToken == null) {
        return res.sendStatus(401);
    }
    if (!refreshTokens.includes(refreshToken)) {
        return res.sendStatus(403);
    }
    jsonwebtoken.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET!,
        (err: any, user: any) => {
            if (err) {
                return res.sendStatus(403);
            }
            const accessToken = generateAccessToken({
                username: user.username,
                email: user.email,
            });
            res.json({ accessToken: accessToken });
        }
    );
});

router.delete('/auth/logout', (req, res) => {
    refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
    res.sendStatus(204);
});

export default router;
