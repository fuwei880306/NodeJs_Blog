var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Category = require('../models/Category');

router.use(function (req, res, next) {
    if (!req.userInfo.isAdmin) {
        return res.send('you are not an admin');
    }
    next();
});

router.get('/', function (req, res, next) {
    return res.render('admin/index', {
        userInfo: req.userInfo
    });
});

router.get('/user', function (req, res) {
    var page = Number(req.query.page) || 1;
    var limit = 2;
    var pages = 0;

    User.countDocuments().then(function (count) {
        pages = Math.ceil(count / limit);
        page = Math.min(page, pages);
        page = Math.max(page, 1);
        var skip = (page - 1) * limit;
        User.find().limit(limit).skip(skip).then(function (users) {
            return res.render('admin/user_index', {
                userInfo: req.userInfo,
                users: users,
                page: page,
                count: count,
                pages: pages,
                limit: limit
            });
        });
    });
});

router.get('/category', function (req, res) {
    return res.render('admin/category_index', {
        userInfo: req.userInfo
    })
});

router.get('/category/add', function (req, res) {
    return res.render('admin/category_add', {
        userInfo: req.userInfo
    })
})

router.post('/category/add', function (req, res) {
    var name = req.body.name || '';
    if (name == '') {
        return res.render('admin/error', {
            userInfo: req.userInfo,
            message: 'name can not be blank'
        })
    }

    Category.findOne({name: name}).then(function (rs) {
        if (rs) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: 'category is already existed'
            });
            return Promise.reject();
        } else {
            return new Category({
                name: name
            }).save();
        }
    }).then(function (rs) {

        return res.render('admin/success', {
            userInfo: req.userInfo,
            message: 'save success',
            url: '/admin/category'
        });
    }).catch(function (error) {
        if (error) {
            console.log(error);
        }
        return;
    });
})

module.exports = router;
