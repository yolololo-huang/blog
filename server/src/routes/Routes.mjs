import express from 'express';
import { query, body, param } from 'express-validator';
import { getTable, postItem, deleteItem, updateDiary } from '../controllers/Controllers.mjs';

const router = express.Router();

router.get('/getTable', 
    query("source").isString().notEmpty().withMessage("Source must not be empty"), // 验证 source 参数
    getTable
);

router.post('/postItem',
    query("source").isString().notEmpty().withMessage("Source must not be empty"), // 验证 source 参数
    body("date").isString().notEmpty().withMessage("Date must not be empty"),
    body("title").isString().notEmpty().withMessage("Title must not be empty"),
    body("content").optional().isString(),
    postItem
);

router.delete('/deleteItem/:date', 
    query("source").isString().notEmpty().withMessage("Source must not be empty"), // 验证 source 参数
    param("date").isString().notEmpty().withMessage("Date must not be empty"),
    deleteItem
);

router.put('/updateItem/:date',
    query("source").isString().notEmpty().withMessage("Source must not be empty"), // 验证 source 参数
    param("date").isString().notEmpty().withMessage("Date must not be empty"),
    body("content").optional().isString(),
    body("title").optional().isString(),
    updateDiary
);

export default router;
