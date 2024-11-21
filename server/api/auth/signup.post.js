import db from '../../db';
import { encryptHash, randomHash } from '../../hash.js'

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { login, password } = body;

  const conn = await db.getConnection();

  try {
    const users = await conn.query("SELECT * FROM users WHERE login=?", [
        login
    ]); 

    if (users.length > 0)
        return { success: false, error: "Логин занят" };

    if (login.length < 3 || login.length > 16)
        return { success: false, error: "Неккоректная длина логина" };

    if (password.length < 3 || password.length > 32)
        return { success: false, error: "Неккоректная длина пароля" };

    const newToken = randomHash();

    const user = await conn.query("INSERT INTO users (login, password, token, permissionId) VALUES (?, ?, ?, 1)", [
        login, encryptHash(password), newToken
    ]);

    return { success: true, token: newToken, userId: parseInt(user.insertId), userName: login };

  } catch (error) {
    return { success: false, error: error.message };
  } finally {
    conn.release();
  }
});