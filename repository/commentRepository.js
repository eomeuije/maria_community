const pool = require('./index')

const commentRepository = {
    findCommentsByPostCode: async (code) => {
        try {
            const connection = await pool.getConnection();
            const query = 
`SELECT c.COMMENT_CODE, u.OWNER_CODE, u.NAME OWNER, c.CONTENT, c.ADD_DATE, c.ADD_TIME
FROM COMMENT c
INNER JOIN USER u on
c.OWNER = u.OWNER_CODE
WHERE c.POST_CODE = ?
ORDER BY c.COMMENT_CODE DESC
`
            const result = await connection.query(query, [code]);
            await connection.release();
            return result;
        } catch (error) {
            console.error('Error while find comments: ', error);
        }
    },
    
    addComment: async (owner, postCode, content, addDate, addTime) => {
        try {
            const connection = await pool.getConnection();
            const result = await connection.query(
`INSERT INTO COMMENT (
    OWNER
    , POST_CODE
    , CONTENT
    , ADD_DATE
    , ADD_TIME
) VALUES (?, ?, ?, ?, ?)`, [owner, postCode, content, addDate, addTime]);
            await connection.release();
            return result;
        } catch (error) {
            console.error('Error while insert comment: ', error);
        }
    },
    
    deleteComment: async (owner, postCode, commentCode) => {
        try {
            const connection = await pool.getConnection();
            const result = await connection.query(
`DELETE
FROM COMMENT
WHERE COMMENT_CODE = ?
AND POST_CODE = ?
AND OWNER = ?`, [commentCode, postCode, owner]);
            await connection.release();
            return result;
        } catch (error) {
            console.error('Error while delete comment: ', error);
        }
    }
}

module.exports = commentRepository;