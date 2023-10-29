// Setup server, session and middleware here.
const express = require('express');
const app = express();
const configRoutes = require('./routes');
const exphbs = require('express-handlebars');
const session = require('express-session');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
const path = require('path');

// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(session({
    name: 'AuthCookie',
    secret: 'some secret string!',
    resave: false,
    saveUninitialized: true
}))

app.use((req, res, next) => {
    let userType = "";
    if (req.session.user) {
        userType = "(Authenticated User)";

    } 
    else {
        userType = "(Non-Authenticated User)";

    }
    console.log("[" + new Date().toUTCString() + "]" + ": " + req.method + " " + req.originalUrl + " " + userType);
    next();
});

app.use('/protected', (req, res, next) => {
    if (!req.session.user) {
        res.status(403).render('forbiddenAccess');
    } 
    else {
        next();
    }
});

configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});