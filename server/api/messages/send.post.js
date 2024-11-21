import db from '../../db';
import { getUserIdByToken } from '../../user'

export default defineEventHandler(async (event) => {

  const body = await readBody(event);
  const { token, content, toUserId } = body;

  const userId = await getUserIdByToken(token);

  if (userId === -1)
    return { success: false, error: "Token not validated" };
  
  const conn = await db.getConnection();

  try {
    const toUser = await conn.query("SELECT id FROM users WHERE id=?", [
        toUserId
    ]);

    if (toUser.length === 0)
        return { success: false, error: "User not exists" };

    const message = await conn.query("INSERT INTO chatMessages (fromUserId, toUserId, content) VALUES (?, ?, ?)", [
        userId, toUserId, content
    ])

    return { success: true };

  } catch (error) {
    return { success: false, error: error.message };
  } finally {
    conn.release();
  }
});