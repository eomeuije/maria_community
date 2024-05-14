const session = require('express-session');
const express = require('express');
const postRouter = require('./controller/post/postController');
const passport = require('passport');
const signRouter = require('./controller/sign/signController');
const port = 3000;
const bodyParser = require('body-parser');
const path = require('path');
const { passportRouter } = require('./controller/sign/signPassport');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', express.static(path.join(__dirname, 'resources')));

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/post', postRouter);
app.use('/sign', signRouter);
app.use('/', passportRouter);

app.get('/', (req, res) => {
    req.session?.passport?.user ? res.redirect('/post') : res.redirect('/main.html');
});


app.listen(port, () => {
    console.log('Maria-Community is started on ' + port)
});