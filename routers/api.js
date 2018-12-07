var express = require('express');
var router = express.Router();
var User = require('../models/User');

var resData;
router.use(function (req, res, next) {
    resData = {
        code: 0,
        message: ''
    };
    next();
})

router.post('/user/register', function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var repassword = req.body.repassword;

    if (username == '') {
        resData.code = 1;
        resData.message = 'username cant not be blank';
        res.json(resData);
        return;
    }

    if (password == '') {
        resData.code = 2;
        resData.message = 'password cant not be blank';
        res.json(resData);
        return;
    }

    if (password != repassword) {
        resData.code = 3;
        resData.message = 'password and repassword is not same';
        res.json(resData);
        return;
    }

    User.findOne({
        username: username
    }).then(function (userInfo) {
        if (userInfo) {
            resData.code = 4;
            resData.message = 'username is already registered';
            res.json(resData);
            return;
        }
        var user = new User({
            username: username,
            password: password
        });
        return user.save();
    }).then(function (newUserInfo) {
        resData.message = 'registered success'
        res.json(resData);
    });

});

router.post('/user/login', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    if (username == '' || password == '') {
        resData.code = 1;
        resData.message = 'username or password can not be blank';
        res.json(resData);
        return;
    }

    User.findOne({
        username: username,
        password: password
    }).then(function (userInfo) {
        if (!userInfo) {
            resData.code = 2;
            resData.message = 'username or password may be wrong';
            res.json(resData);
            return;
        }

        console.log(req.cookies);
        resData.message = 'login success';
        resData.userInfo = {
            _id: userInfo._id,
            username: userInfo.username,
            isAdmin:userInfo.isAdmin
        };
        req.cookies.set('userInfo',JSON.stringify(resData.userInfo));
        res.json(resData);
        return;
    })
})

router.get('/user/logout',function (req,res) {
    req.cookies.set('userInfo',null);
    res.json(resData);
})

module.exports = router;