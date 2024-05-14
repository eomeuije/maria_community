const pool = require('./index')

const signRepository = {
    findUserById: async (id) => {
        try {
            const connection = await pool.getConnection();
            const result = await connection.query(`
SELECT OWNER_CODE, ID, PASSWORD, NAME
FROM USER
WHERE ID = ?
`, [id]);
            await connection.release();
            return result;
        } catch (error) {
            console.error('Error while find user: ', error);
        }
    },
    
    addSign: async (id, name, password) => {
        try {
            const connection = await pool.getConnection();
            const result = await connection.query(
`INSERT INTO USER (
    ID
    , NAME
    , PASSWORD
) VALUES (?, ?, ?)`, [id, name, password]);
            await connection.release();
            return result;
        } catch (error) {
            console.error('Error while insert sign: ', error);
        }
    }
}

module.exports = signRepository