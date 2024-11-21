import db from '../../db';
import { getUserIdByToken } from '../../user'

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { token, id } = body;

  const userId = await getUserIdByToken(token);

  if (userId === -1)
    return { success: false, error: "Token not validated" };

  const conn = await db.getConnection();
  try {
    const messages = await conn.query("SELECT u.id, u.login, m.content FROM chatMessages AS m JOIN users AS u ON u.id = m.fromUserId WHERE fromUserId=? AND toUserId=? OR fromUserId=? AND toUserId=? ORDER BY m.sendedDate", [
        id, userId, userId, id
    ]);
    
    return { success: true, messages };
  } catch (error) {
    return { success: false, error: error.message };
  } finally {
    conn.release();
  }
});