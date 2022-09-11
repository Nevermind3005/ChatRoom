import express from 'express';
import authAPI from './Api/authAPI';
import { authenticateToken } from './Services/authService';
import db, { addUsersToDB } from './db';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', authAPI);
const port = 3000;

declare global {
    namespace Express {
        interface Request {
            user?: Record<string, any>;
        }
    }
}

addUsersToDB({
    username: 'admin',
    email: 'admin@admin.com',
    password: 'password',
});

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

app.listen(port, () => {
    console.log(`Listening on port http://localhost:${port}`);
});