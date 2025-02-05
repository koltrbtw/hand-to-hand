import db from '../../db';

// Рекомендованные объявления
export default defineEventHandler(async () => {

  const conn = await db.getConnection();
  try {
    const announcements = await conn.query('SELECT a.id, a.price, a.title, aI.data AS `image` FROM announcements AS a JOIN announcementImages AS aI ON aI.announcementId=a.id WHERE a.completed=0 GROUP BY a.id LIMIT 30');

    for (const announcement of announcements)
      announcement.image = announcement.image.toString('base64')

    return { success: true, data: announcements };
  } catch (error) {
    return { success: false, error: error.message };
  } finally {
    conn.release();
  }
});