import mysql from 'mysql2'

const createPool = (database) => {
    return mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: 'yolomysql',
        database: database
    }).promise()
}
// 创建连接池
const dataPool = createPool('diarypool');

// 测试数据库连接
dataPool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        return;
    }

    console.log('Connected to the database');
    
    // 释放连接
    connection.release();
});

export { dataPool };