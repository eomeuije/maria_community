const express = require("express");
const router = express.Router();
const passport = require('passport');
const signService = require('../../service/signService');
const { isLoggedIn, isNotLoggedIn } = require("./signPassport");

router.get('/in', isNotLoggedIn, (req, res) => {
    res.render('sign/in');
  });

router.post('/in', isNotLoggedIn, passport.authenticate('local', {
  successRedirect: '/post',
  failureRedirect: '/sign/in?error=1', // 로그인 실패 시 이동할 경로
}), (req, res) => {
  res.send('Login successful');
});

router.get('/up', isNotLoggedIn, (req, res) => {
  res.render('sign/up');
});

router.post('/up', isNotLoggedIn, async (req, res) => {
  try {
    const user = req.body;
    await signService.signup(user.id, user.name, user.password);
    res.redirect('/sign/in')
  } catch {
    res.redirect('/sign/up?error=1')
  }
});

router.post('/logout', isLoggedIn, (req, res) => {
  req.logout(err => {
    if (err) {
      return next(err);
    } else {
      res.send('success');
    }
  });
});

module.exports = router; 