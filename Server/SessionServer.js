var parseurl = require('parseurl')

module.exports.SessionMiddleWare = function () {
    return function (req, res, next) {
        VisitCounter(req, res)
        AuthChecker(req, res)
        next()
    }
}

function VisitCounter(req, res) {
    if (!req.session.views) {
        req.session.views = {}
    }
    // get the url pathname
    var pathname = parseurl(req).pathname
    // count the views
    req.session.views[pathname] = (req.session.views[pathname] || 0) + 1
    console.log('you viewed this page ' + req.session.views[pathname] + ' times')
}

function AuthChecker(req, res) {
    if (!req.session.auth) {
        req.session.auth = {}
    }

    // count the views
    if (req.session.auth['state'] === true) {
        console.log('logged in user')
    }
}