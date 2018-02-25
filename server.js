console.log("server stared")

var wsServer = require('ws').Server;
wss = new wsServer({port:8222});

const path = require('path');
const fs = require('fs');
const express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

app.get('/hello', (req, res) => res.send("hello world!"));

app.get('/signup', function(req, res){
    res.sendFile(path.join(__dirname + '/signup.html'));
})

app.post('/signup', function(req, res){
    console.log(req.body.username);
    console.log(req.body.password); 
    var username = req.body.username;
    var password = req.body.password;
    if (username.length >= 4 && password.length >= 6 && password === req.body.repassword) {
        var users = fs.readFileSync('./db/accounts', 'utf8')
        if (typeof(users) === 'string' && users.length === 0) {   // if the file is empty
            users = [];
        } else {
            users = JSON.parse(users)
        }
        console.log(typeof(users));
        users.push({username: username, password: password})
        var usersString = JSON.stringify(users)
        fs.writeFileSync('./db/accounts', usersString)
        res.send('finished');
    }
    else {
        res.statusCode = 400;
        res.send('failed');
    }
})

app.get('/signin', function(req, res){
    console.log('Get Cookies: ', req.cookies)
    if (typeof(req.cookies.loginstate) !== 'undefined') {
        var users = fs.readFileSync('./db/accounts', 'utf8')
        if (typeof(users) === 'string' && users.length === 0) {   // if the file is empty
            users = [];
        } else {
            users = JSON.parse(users)
        }

        if (users.filter(x => x.username + x.password === req.cookies.loginstate))
        {
            res.send('already loggedin')
        }
    }
    res.sendFile(path.join(__dirname + '/signin.html'));
})

app.post('/signin', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var users = fs.readFileSync('./db/accounts', 'utf8')
    console.log('type login: ' + typeof(users))
    console.log(users)    
    console.log('Cookies: ', req.cookies)
    if (typeof(users) === 'string' && users.length === 0) {   // if the file is empty
        res.sendFile(path.join(__dirname + '/signup.html'));
    } else {
        users = JSON.parse(users);
        console.log(users.filter(x => x.username === username && x.password === password))
        console.log(typeof(username))
        if (users.filter(x => x.username === username).length === 1) {
            if (users.filter(x => x.password === password).length === 1) {
                console.log('found');
                res.cookie('loginstate', username + password, { maxAge: 60000, httpOnly: true });
                res.send('loggedin');
            } else {
                res.send('password incorrect');
            }
            
        } else {
            res.send('no user find');
        }
    }
})

app.listen(3000, () => console.log("app start listening on port 3000"));

wss.on('connection', function(ws) {
    console.log('client connected');
    ws.on('message', function(ms) {
        console.log(ms);
    })
})

