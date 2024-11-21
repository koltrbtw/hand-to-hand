import db from '../../db';
import { getUserIdByToken } from '../../user'

export default defineEventHandler(async (event) => {

  const body = await readBody(event);
  const { token } = body;

  const userId = await getUserIdByToken(token);

  if (userId === -1)
    return { success: false, error: "Token not validated" };
  
  const conn = await db.getConnection();

  try {

    const chats = await conn.query("SELECT m.fromUserId AS `userId`, u.login AS `userName`, m.content FROM chatMessages m JOIN users u ON u.id = m.fromUserId WHERE m.sendedDate = (SELECT MAX(s.sendedDate) FROM chatMessages s WHERE s.fromUserId = m.fromUserId ) AND m.toUserId = ? ORDER BY m.sendedDate DESC", [
      userId
    ]);

    const user = await conn.query("SELECT login FROM users WHERE id=?", [userId]);

    return { success: true, chats, userId: userId, userName: user[0].login };
  } catch (error) {
    return { success: false, error: error.message };
  } finally {
    conn.release();
  }
});