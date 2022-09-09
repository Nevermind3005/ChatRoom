import express from 'express';
import sqlite3 from 'sqlite3';
import jsonwebtoken, { JsonWebTokenError, VerifyErrors } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import {
    authenticateToken,
    generateAccessToken,
    generateRefreshToken,
    UserToken,
} from './Service/authService';

dotenv.config({ path: './.env' });

const app = express();
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
    db.run('create table users (username text, password text, email text);');
});

const insert = 'insert into users (username, password, email) values (?, ?, ?)';

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const port = 3000;

let refreshTokens: Array<string> = new Array();

declare global {
    namespace Express {
        interface Request {
            user?: Record<string, any>;
        }
    }
}

interface User {
    username: string;
    password: string;
    email: string;
}

app.get('/', authenticateToken, (req, res) => {
    db.all('select username, email from users;', (_, data) =>
        res.status(200).send(data)
    );
});

app.get('/:email', (req, res) => {
    const { email } = req.params;
    db.get(
        'select username, email from users where email = ?;',
        email,
        async (err, row) => {
            if (row == null) {
                return res.sendStatus(404);
            }
            res.status(200).send(row);
        }
    );
});

app.post('/auth/signup', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user: User = {
            username: req.body.username,
            password: hashedPassword,
            email: req.body.email,
        };
        db.run(insert, [user.username, user.password, user.email]);

        res.status(201).send();
    } catch {
        res.status(500).send();
    }
});

app.post('/auth/login', async (req, res) => {
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

app.post('/auth/token', (req, res) => {
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

app.get('/user/me', authenticateToken, (req, res) => {
    const userToken: any = req.user;
    db.get(
        'select username, email from users where email = ?;',
        userToken.email,
        async (err, row) => {
            if (row == null) {
                return res.sendStatus(404);
            }
            res.status(200).send(row);
        }
    );
});

app.delete('/auth/logout', (req, res) => {
    refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
    res.sendStatus(204);
});

app.listen(port, () => {
    console.log(`Listening on port http://localhost:${port}`);
});
