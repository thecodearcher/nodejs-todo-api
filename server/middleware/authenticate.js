var {User} = require('./../model/user');

var authenticate = (req, res, next) => {
    var token = req.header('x-auth');

    User.findByToken(token)
        .then((user) => {
            if (!user) {
                return Promise.reject();
            }

            req.user = user;
            req.token = user.token;
            next();
        })
        .catch(() => {
            res.status(401).send();
        });
};

module.exports.authenticate= authenticate;