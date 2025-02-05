import db from '../../db';

// Проверка токена
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { token } = body;

  const conn = await db.getConnection();

  try {
    const users = await conn.query("SELECT * FROM users WHERE token=?", [
        token
    ]); 

    return { success: users.length > 0 };

  } catch (error) {
    return { success: false, error: error.message };
  } finally {
    conn.release();
  }
});