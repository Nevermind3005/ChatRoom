import express, { Router } from 'express';
import bcrypt from 'bcrypt';
import User from '../Models/User';
import UserToken from '../Models/UserToken';
import jsonwebtoken from 'jsonwebtoken';
import db, {
    addUsersToDB,
    addRefreshTokenToDB,
    removeRefreshTokenFromDB,
    selectCountToken,
} from '../db';

import {
    generateAccessToken,
    generateRefreshToken,
} from '../Services/authService';
import { debug } from 'console';

const router: Router = express.Router();

router.post('/auth/signup', async (req, res) => {
    try {
        const user: User = {
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            //Icon source: <a href="https://www.flaticon.com/free-icons/user" title="user icons">User icons created by Freepik - Flaticon</a>
            userImage: 'user.png',
        };
        addUsersToDB(user);
        res.json({
            username: req.body.username,
            email: req.body.email,
        });
        res.status(201).send();
    } catch {
        res.status(500).send();
    }
});

router.post('/auth/login', async (req, res) => {
    console.log(process.env);
    const email = req.body.email;
    db.get('select * from users where email = ?;', email, async (_, row) => {
        if (row == null) {
            return res.sendStatus(404);
        }
        const user: User = {
            username: row.username,
            password: row.password,
            email: row.email,
            userImage: row.userImage,
        };
        try {
            if (await bcrypt.compare(req.body.password, user.password)) {
                const userToken: UserToken = {
                    username: user.username,
                    email: user.email,
                };
                //const accessToken = generateAccessToken(userToken);
                const refreshToken = generateRefreshToken(userToken);
                addRefreshTokenToDB(refreshToken);
                //res.json({ accessToken: accessToken });
                res.cookie('rtok', refreshToken, {
                    httpOnly: true,
                    path: '/auth/',
                });
                res.status(200);
                res.send();
            } else {
                res.send('Now allowed');
            }
        } catch (err) {
            console.log(err);

            res.status(500).send();
        }
    });
});

router.post('/auth/token', (req, res) => {
    const refreshToken = req.cookies.rtok;
    if (refreshToken == null) {
        return res.sendStatus(401);
    }
    db.get(selectCountToken, [refreshToken], (_, row) => {
        console.log(row.count);
        if (row.count !== 1) {
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
                // res.cookie('atok', accessToken, {
                //     httpOnly: true,
                //     path: '/',
                // });
                res.json({ accessToken: accessToken });
                res.status(200).send();
            }
        );
    });
});

router.delete('/auth/logout', (req, res) => {
    removeRefreshTokenFromDB(req.cookies.rtok);
    res.sendStatus(204);
});

export default router;
