const webSocketServer = require('./WebSocketServer.js');
const auth = require('./SessionServer.js');

console.log("server stared")
const path = require('path');
const fs = require('fs');
const http = require('http');
const port = process.env.PORT || 3000;
const dbPath = path.join(__dirname, '/../db/accounts');

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const session = require('express-session')
const app = express();
const httpServer = http.createServer(app)
app.use(express.static(path.join(__dirname, '/../css')))
app.use(express.static(path.join(__dirname, '/../Resources')))
app.use(express.static(path.join(__dirname, '/../public')))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(session({
    secret: 'menti',
    resave: false,
    saveUninitialized: true
}))

app.use(auth.SessionMiddleWare())

app.get('/hello', (req, res) => res.send("hello world!"));
app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/../index.html')));
app.get('/chat', (req, res) => res.sendFile(path.join(__dirname + '/../chat.html')));

app.get('/signup', function (req, res) {
    res.sendFile(path.join(__dirname + '/../signup.html'));
})

app.post('/signup', function (req, res) {
    console.log(req.body.username);
    console.log(req.body.password);
    var username = req.body.username;
    var password = req.body.password;
    if (username.length >= 4 && password.length >= 6 && password === req.body.repassword) {
        var users = fs.readFileSync(dbPath, 'utf8')
        if (typeof (users) === 'string' && users.length === 0) {   // if the file is empty
            users = [];
        } else {
            users = JSON.parse(users)
        }
        console.log(typeof (users));
        users.push({ username: username, password: password })
        var usersString = JSON.stringify(users)
        fs.writeFileSync(dbPath, usersString)
        res.send('finished');
    }
    else {
        res.statusCode = 400;
        res.send('failed');
    }
})

app.get('/signin', function (req, res) {
    console.log('Get Cookies: ', req.cookies)
    if (typeof (req.session.auth) !== 'undefined') {
        var users = fs.readFileSync(dbPath, 'utf8')
        if (typeof (users) === 'string' && users.length === 0) {   // if the file is empty
            users = [];
        } else {
            users = JSON.parse(users)
        }

        if (req.session.auth['state']) {
            res.send('already loggedin')
        }
    }
    res.sendFile(path.join(__dirname + '/../signin.html'));
})

app.post('/signin', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var users = fs.readFileSync(dbPath, 'utf8')
    console.log('type login: ' + typeof (users))
    console.log(users)
    console.log('Cookies: ', req.cookies)
    if (typeof (users) === 'string' && users.length === 0) {   // if the file is empty
        res.sendFile(path.join(__dirname + '/../signup.html'));
    } else {
        users = JSON.parse(users);
        console.log(users.filter(x => x.username === username && x.password === password))
        console.log(typeof (username))
        if (users.filter(x => x.username === username).length === 1) {
            if (users.filter(x => x.password === password).length === 1) {
                console.log('found');
                req.session.auth['state'] = true;
                res.send('loggedin');
            } else {
                res.send('password incorrect');
            }

        } else {
            res.send('no user find');
        }
    }
})

app.listen(port, () => console.log("app start listening on port " + port));

webSocketServer.run();