import db from '../../db';
import fs from 'fs';
import formidable from 'formidable';
import { getUserIdByToken } from '../../user'

export default defineEventHandler(async (event) => {
  const form = formidable({ multiples: true });

  return new Promise((resolve, reject) => {
    form.parse(event.req, async (err, fields, files) => {
      console.log("parse start")

      if (err) {
        reject(err);
      }

      try {
        const { token, categoryId, price, title, description } = fields;
        const images = files.photos;

        console.log(fields)

        const userId = await getUserIdByToken(token);

        if (userId == -1 || !categoryId || !title || !description || !images) {
          return resolve({ success: false, error: 'Missing required fields' });
        }

        const conn = await db.getConnection();

        try {
          const result = await conn.query(
            'INSERT INTO announcements (creatorUserId, categoryId, price, title, description) VALUES (?, ?, ?, ?, ?)',
            [userId, categoryId, price, title, description]
          );
          
          for(const image of images)
          {
              const imageContent = fs.readFileSync(image.filepath);

              await conn.query(
                'INSERT INTO announcementImages (announcementId, data) VALUES (?, ?)',
                [result.insertId, imageContent]
              );
          }

          return resolve({ success: true, id: parseInt(result.insertId) });
        } catch (error) {
          return resolve({ success: false, error: error.message });
        } finally {
          conn.release();
        }
      } catch (error) {
        reject(error);
      }
    });
  });
});