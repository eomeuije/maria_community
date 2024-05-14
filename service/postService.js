const postRepository = require('../repository/postRepository');
const commentRepository = require('../repository/commentRepository');
const moment = require('moment');

const dateFormat = 'YYYY-MM-DD';
const timeFormat = 'HH:mm:ss';
const postPerPage = 10;

const getDateAndTime = () => {
    const mo = moment();
    return [mo.format(dateFormat), mo.format(timeFormat)];
}

const postService = {
    getEndPage: async () => {
        const result = await postRepository.getPostCount();
        const count = result[0].count;
        return parseInt(Number(count) / postPerPage) + 1;
    },
    findPostsByPage: (page) => {
        const offset = postPerPage * Number(page - 1);
        return postRepository.findAll(postPerPage, offset);
    },
    addPost: (title, content, owner) => {
        const [date, time] = getDateAndTime();
        return postRepository.addPost(title, content, owner, date, time);
    },
    addLikeThis: (owner, postCode) => {
        return postRepository.addLikeThis(owner, Number(postCode));
    },
    addComment: (owner, postCode, content) => {
        const [date, time] = getDateAndTime();
        return commentRepository.addComment(owner, Number(postCode), content, date, time);
    },
    findPostDetails: async (owner, code) => {
        const details = (await postRepository.findPostByCode(code))[0];
        const like = await postRepository.getLike(code);
        details.isLikeThis = false;
        for (var i = 0; i < like.length; i++) {
            if (like[i].OWNER == owner) {
                details.isLikeThis = true;
                break;
            }
        }
        details.likeCount = like.length;
        const comments = await commentRepository.findCommentsByPostCode(code);
        details.comments = comments;
        return details;
    },
    deletePostByOwnerAndCode: (owner, code) => {
        return postRepository.deletePost(owner, code);
    },
    deleteCommentByOwnerAndCodes: (owner, postCode, commentCode) => {
        return commentRepository.deleteComment(owner, Number(postCode), Number(commentCode));
    }
}

module.exports = postService