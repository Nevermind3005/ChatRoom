import sqlite3 from 'sqlite3';
import User from './Models/User';
import bcrypt from 'bcrypt';

const db = new sqlite3.Database(':memory:', initDBTable);

const insertUser =
    'insert into users (username, password, email, userImage) values (?, ?, ?, ?)';

const insertToken = 'insert into refresh_tokens (token) values (?)';

export const selectCountToken =
    'select count(*) as count from refresh_tokens where token = ?';

const deleteToken = 'delete from refresh_tokens where token = ?';

function initDBTable() {
    db.serialize(() => {
        db.run(
            'create table users (username text, password text, email text, userImage text);'
        );
        db.run('create table refresh_tokens (token text)');
    });
}

export async function addUsersToDB(user: User) {
    user.password = await bcrypt.hash(user.password, 10); //Should be in separate function
    db.run(insertUser, [
        user.username,
        user.password,
        user.email,
        user.userImage,
    ]);
    console.log(
        `${new Date().toUTCString()} Added user: ${user.username} to database`
    );
}

export async function addRefreshTokenToDB(token: string) {
    db.run(insertToken, [token]);
    console.log(`${new Date().toUTCString()} Added token to database`);
}

export async function removeRefreshTokenFromDB(token: string) {
    db.run(deleteToken, [token]);
    console.log(`${new Date().toUTCString()} Removed token from database`);
}

export default db;
