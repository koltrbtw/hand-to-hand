import db from './db.js';

export const getUserIdByToken = async function(token) {
    const conn = await db.getConnection();

    try {
        const users = await conn.query("SELECT id FROM users WHERE token=?", [
            token
        ]); 

        if (users.length == 0)
            return -1;

        return users[0].id;
    } catch (error) {
        return -1;
    } finally {
        conn.release();
    }
};
