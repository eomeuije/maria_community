const signRepository = require('../repository/signRepository');
const bcrypt = require('bcrypt');
const salt = 10;

const signService = {
    findUserById: async (id) => {
        const user = (await signRepository.findUserById(id))[0];
        if (!user) {
            throw new Error('ID is not Found');
        }
        
        return user;
    },
    correctPasswordOrThrow: async (plainPassword, passwordFromDB) => {
        const isCorrect = await bcrypt.compare(plainPassword, passwordFromDB);
        if (!isCorrect) {
            throw new Error('Password is incorrect');
        }
        return isCorrect;
    },
    signup: async (id, name, password) => {
        const user = (await signRepository.findUserById(id))[0]
        if (user?.OWNER_CODE) {
            throw new Error('ID is duplicated');
        }
        password = await bcrypt.hash(password, salt);
        return signRepository.addSign(id, name, password);
    }
}

module.exports = signService