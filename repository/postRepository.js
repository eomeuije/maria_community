const pool = require('./index')

const postRepository = {
    getPostCount: async () => {
        try {
            const connection = await pool.getConnection();
            const result = await connection.query('SELECT COUNT(*) count FROM POST');
            await connection.release();
            return result;
        } catch (error) {
            console.error('Error while find posts all: ', error);
        }
    },
    findAll: async (limit, offset) => {
        try {
            const connection = await pool.getConnection();
            const result = await connection.query(`
SELECT p.POST_CODE, p.TITLE, u.OWNER_CODE, u.NAME OWNER, p.ADD_DATE, p.ADD_TIME, COUNT(l.POST_CODE) LIKES 
FROM POST p
INNER JOIN USER u ON
p.OWNER = u.OWNER_CODE
LEFT OUTER JOIN LIKE_THIS l ON
p.POST_CODE = l.POST_CODE
GROUP BY p.POST_CODE
order by p.POST_CODE DESC
LIMIT ?
OFFSET ?
`, [limit, offset]);
            await connection.release();
            return result;
        } catch (error) {
            console.error('Error while find posts all: ', error);
        }
    },

    findPostsByKey: async (key) => {
        try {
            const connection = await pool.getConnection();
            const query = 
`SELECT POST_CODE, TITLE, OWNER, ADD_DATE, ADD_TIME
FROM POST 
WHERE title = ?
or content = ?
or owner = ?
order by p.POST_CODE DESC
`
            const result = await connection.query(query, [key, key, key]);
            await connection.release();
            return result;
        } catch (error) {
            console.error('Error while find posts: ', error);
        }
    },

    findPostByCode: async (code) => {
        try {
            const connection = await pool.getConnection();
            const query = 
`SELECT p.POST_CODE, p.TITLE, p.CONTENT, p.ADD_DATE, p.ADD_TIME, u.OWNER_CODE, u.NAME OWNER
FROM POST p
INNER JOIN USER u ON
p.OWNER = u.OWNER_CODE
WHERE p.POST_CODE = ?
`
            const result = await connection.query(query, [code]);
            await connection.release();
            return result;
        } catch (error) {
            console.error('Error while find posts: ', error);
        }
    },

    addLikeThis: async (owner, postCode) => {
        try {
            const connection = await pool.getConnection();
            const  result = await connection.query(
`INSERT INTO like_this (
    OWNER
    , POST_CODE
) VALUES (?, ?)`, [owner, postCode]);
            await connection.release();
            return result;
        } catch (error) {
            console.error('Error while insert post: ', error);
        }
    },

    getLike: async (postCode) => {
        try {
            const connection = await pool.getConnection();
            const query = 
`SELECT OWNER, POST_CODE
FROM like_this
WHERE POST_CODE = ?
`
            const result = await connection.query(query, [postCode]);
            await connection.release();
            return result;
        } catch (error) {
            console.error('Error while find posts: ', error);
        }
    },
    
    addPost: async (title, content, owner, addDate, addTime) => {
        try {
            const connection = await pool.getConnection();
            const result = await connection.query(
`INSERT INTO POST (
    TITLE
    , CONTENT
    , OWNER
    , ADD_DATE
    , ADD_TIME
) VALUES (?, ?, ?, ?, ?)`, [title, content, owner, addDate, addTime]);
            await connection.release();
            return result;
        } catch (error) {
            console.error('Error while insert post: ', error);
        }
    },

    deletePost: async (owner, code) => {
        try {
            const connection = await pool.getConnection();
            const result = await connection.query(
`DELETE
FROM POST
WHERE POST_CODE = ?
AND OWNER = ?
`, [code, owner]);
            await connection.release();
            return result;
        } catch (error) {
            console.error('Error while insert post: ', error);
        }
    }
}

module.exports = postRepository