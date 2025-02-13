import { dataPool } from '../db.mjs';

export const fetchTable = async (source) => {
    const query = `SELECT * FROM ${source}`;
    const [rows] = await dataPool.query(query);
    return rows;
}

export const addItem = async (source, date, title, content) => {
    const query = `INSERT INTO ${source} (date, title, content) VALUES (?, ?, ?)`;
    await dataPool.query(query, [date, title, content]);
}

export const removeItem = async (source, date) => {
    const query = `DELETE FROM ${source} WHERE date = ?`;
    await dataPool.query(query, [date]);
}

export const modifyItem = async (source, date, content, title) => {
    const query = `UPDATE ${source} SET content = ?, title = ? WHERE date = ?`;
    await dataPool.query(query, [content, title, date]);
};
