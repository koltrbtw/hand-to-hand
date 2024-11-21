import db from '../../db';
import { encryptHash, randomHash } from '../../hash.js'

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { login, password } = body;

  const conn = await db.getConnection();

  try {
    const users = await conn.query("SELECT * FROM users WHERE login=? AND password=?", [
        login, encryptHash(password)
    ]); 

    if (users.length === 0)
        return { success: false, error: "Аккаунт не был найден" };

    const user = users[0];
    const newToken = randomHash();

    await conn.query("UPDATE users SET token=? WHERE id=?", [
        newToken, user.id
    ]); 

    return { success: true, token: newToken, userId: user.id, userName: login };
  } catch (error) {
    return { success: false, error: error.message };
  } finally {
    conn.release();
  }
});