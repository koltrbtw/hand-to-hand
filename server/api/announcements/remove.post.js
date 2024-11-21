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
    const announcement = await conn.query("SELECT creatorUserId FROM announcements WHERE id=?", [
        id
    ]);

    console.log(announcement)

    if (announcement.length === 0 || announcement[0].creatorUserId !== userId)
        return { success: false, error: "No access" };

    await conn.query("DELETE FROM announcements WHERE id=?", [
        id
    ]);

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  } finally {
    conn.release();
  }
});