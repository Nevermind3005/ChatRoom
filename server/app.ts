import express from 'express';
import authAPI from './Api/authAPI';
import { authenticateToken } from './Services/authService';
import db, { addUsersToDB } from './db';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const corsOptions = {
    origin: 'http://localhost:4200',
    credentials: true,
    optionsSuccessStatus: 200,
};

const app = express();

app.use(express.json());
app.use(express.static('static'));
app.use(cors(corsOptions));
app.use(cookieParser());
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
    userImage: 'default_user.jpg',
});

app.get('/', authenticateToken, (req, res) => {
    db.all('select username, email from users;', (_, data) =>
        res.status(200).send(data)
    );
});

app.get('/user/me', authenticateToken, (req, res) => {
    const userToken: any = req.user;
    db.get(
        'select username, email, userImage from users where email = ?;',
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
