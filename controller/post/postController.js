const express = require("express");
const router = express.Router();
const postService = require('../../service/postService');
const { isLoggedIn } = require("../sign/signPassport");

router.get('/page/:page', isLoggedIn, async (req, res) => {
    const page = req.params.page;
    const result = await posts(page);
    result.user = req.session.passport.user
    res.render('post/main', result);
});

router.get('/', isLoggedIn, async (req, res) => {
    res.redirect('/post/page/1');
});

const posts = async (page) => {
    const pagePerScreen = 11;
    const p = parseInt(pagePerScreen / 2);
    const totalPage = await postService.getEndPage();
    page = Number(page)
    endPage = page + p > totalPage ? totalPage : page + p < pagePerScreen ? pagePerScreen : page + p
    const startPage = page - p <= 0 ? 1 : endPage - page > p ? page - p : endPage - pagePerScreen + 1;

    const posts = await postService.findPostsByPage(page);
    return {posts: posts, startPage: startPage <= 0 ? 1 : startPage, endPage: endPage, currentPage: page};
}

router.get('/detail/:id', isLoggedIn, async (req, res) => {
    const owner = req.session.passport.user.OWNER_CODE;
    const details = await postService.findPostDetails(owner, req.params.id);
    res.render('post/detail', {post: details, user: req.session.passport.user});
});

router.post('/like-this', isLoggedIn, async (req, res) => {
    const { postCode } = req.body;
    const owner = req.session.passport.user.OWNER_CODE;
    await postService.addLikeThis(owner, postCode)
    res.send({error: false});
});

router.get('/new', isLoggedIn, async (req, res) => {
    res.render('post/new', {user: req.session.passport.user});
});

router.post('/new', isLoggedIn, async (req, res) => {
    let { title, content } = req.body;
    content = content.replaceAll('\r\n', '<br>')
    const owner = req.session.passport.user.OWNER_CODE;

    if (!title) {
        return res.status(400).json({ error: 'Title and content are required' });
    }
    await postService.addPost(title, content, owner);
    res.redirect('/post');
});

router.post('/comment/new', isLoggedIn, async (req, res) => {
    const { postCode, content } = req.body;
    const owner = req.session.passport.user.OWNER_CODE;
    await postService.addComment(owner, postCode, content);
    res.redirect('/post/detail/' + postCode);
});

router.post('/delete', isLoggedIn, async (req, res) => {
    const { postCode } = req.body;
    const owner = req.session.passport.user.OWNER_CODE;
    await postService.deletePostByOwnerAndCode(owner, postCode);
    res.redirect('/post');
});

router.post('/comment/delete', isLoggedIn, async (req, res) => {
    const { postCode, commentCode } = req.body;
    const owner = req.session.passport.user.OWNER_CODE;
    await postService.deleteCommentByOwnerAndCodes(owner, postCode, commentCode);
    res.redirect('/post/detail/' + postCode);
});

module.exports = router;