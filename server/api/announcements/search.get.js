import db from '../../db';
import { getQuery } from 'h3';

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const findWords = query.words;

    const priceFrom = query.from;
    const priceTo = query.to;

    const categoryId = query.category;

    let querySql = "SELECT a.id, a.price, a.description, a.title, aI.data AS `image` FROM announcements AS a JOIN announcementImages AS aI ON aI.announcementId=a.id";
    let queryAdditional = "";
    let querySqlValues = [];

    if (findWords !== undefined) {
        queryAdditional += "a.title LIKE ? AND a.description LIKE ?"
        
        querySqlValues.push('%' + findWords + '%', '%' + findWords + '%');
    }

    if (priceFrom !== undefined) {
        queryAdditional += (queryAdditional.length == 0 ? "" : " AND ") + "a.price > ?";

        querySqlValues.push(priceFrom);
    }

    if (priceTo !== undefined) {
        queryAdditional += (queryAdditional.length == 0 ? "" : " AND ") + "a.price < ?";

        querySqlValues.push(priceTo);
    }
    
    if (categoryId !== undefined)
    {
        queryAdditional += (queryAdditional.length == 0 ? "" : " AND ") + "a.categoryId = ?";
        
        querySqlValues.push(categoryId);
    }

    if (queryAdditional.length > 0)
    {
        querySql += " WHERE " + queryAdditional;
    }

    querySql += " GROUP BY a.id"


  const conn = await db.getConnection();
    try {
        const announcements = await conn.query(querySql, querySqlValues);

        for (const announcement of announcements)
            announcement.image = announcement.image.toString('base64')

        return { success: true, data: announcements };
    } catch (error) {
        return { success: false, error: error.message };
    } finally {
        conn.release();
    }
});