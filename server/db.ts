import sqlite3 from 'sqlite3';
import User from './Models/User';
import bcrypt from 'bcrypt';

const db = new sqlite3.Database(':memory:', initDBTable);

export const insertUser =
    'insert into users (username, password, email) values (?, ?, ?)';

function initDBTable() {
    db.serialize(() => {
        db.run(
            'create table users (username text, password text, email text);'
        );
    });
}

export async function addUsersToDB(user: User) {
    user.password = await bcrypt.hash(user.password, 10);
    db.run(insertUser, [user.username, user.password, user.email]);
    console.log(`Added user: ${user.username} to database`);
}
export default db;
