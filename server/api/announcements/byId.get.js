import db from '../../db';
import { getQuery } from 'h3';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const id = query.id;

  const conn = await db.getConnection();
  try {
    let announcement = await conn.query('SELECT a.id AS `id`, u.login AS `author`, a.price, a.title, a.`description`, a.creatorUserId AS `authorId` FROM announcements AS a JOIN users AS u ON u.id=a.creatorUserId WHERE a.id=?', [
      id
    ]);

    const images = await conn.query('SELECT data FROM announcementImages WHERE announcementId=?', [
      id
    ]);

    announcement = announcement[0];

    announcement.images = [];

    for(const image of images)
      announcement.images.push(image.data.toString('base64'));

    return { success: true, announcement, id };

  } catch (error) {
    return { success: false, error: error.message };
  } finally {
    conn.release();
  }
});