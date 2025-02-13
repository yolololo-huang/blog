import { fetchTable, addItem, removeItem, modifyItem } from '../models/Models.mjs';

export const getTable = async (req, res) => {
    try {
        const { source } = req.query; // 从请求的查询参数中获取 source
        if (!source) {
            return res.status(400).send("Source is required");
        }

        const diaries = await fetchTable(source);
        res.send(diaries);
    } catch (err) {
        res.status(500).send(err);
    }
}

export const postItem = async (req, res) => {
    try {
        const { source } = req.query; // 从请求的查询参数中获取 source
        const { date, title, content } = req.body; // 从请求体中获取参数
        if (!source || !date) {
            return res.status(400).send("Source and date are required");
        }
        await addItem(source, date, title, content);
        res.status(201).send("Entry added successfully");
    } catch (err) {
        res.status(500).send(err);
    }
}

export const deleteItem = async (req, res) => {
    try {
        const { source } = req.query; // 从请求的查询参数中获取 source
        const { date } = req.params;
        if (!source || !date) {
            return res.status(400).send("Source and date are required");
        }
        await removeItem(source, date);
        res.status(200).send("Entry deleted successfully");
    } catch (err) {
        res.status(500).send(err);
    }
}

export const updateDiary = async (req, res) => {
    try {
        const { source } = req.query; // 从请求的查询参数中获取 source
        const { date } = req.params;
        const { content, title } = req.body;
        if (!source || !date) {
            return res.status(400).send("Source and date are required");
        }
        await modifyItem(source, date, content, title);
        res.status(200).send("Entry updated successfully");
    } catch (err) {
        res.status(500).send(err);
    }
}
