//应用程序的启动入口文件

//加载express模块
var express = require('express');
//创建app应用,相当于nodeJS的http.createService()
var swig = require('swig');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Cookies = require('cookies');
var app = express();
var User = require('./models/User');

app.engine('html', swig.renderFile);
app.set('views', './views');
app.set('view engine', 'html');
swig.setDefaults({cache: false});
app.use('/public', express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));


app.use(function (req, res, next) {
    req.cookies = new Cookies(req, res);
    req.userInfo = {};
    if (req.cookies.get('userInfo')) {
        try {
            req.userInfo = JSON.parse(req.cookies.get('userInfo'))
            User.findById(req.userInfo._id).then(function (userInfo) {
                req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
            })
        } catch (e) {
        }
    }
    next();
});

app.use('/admin', require('./routers/admin'));
app.use('/api', require('./routers/api'));
app.use('/', require('./routers/main'));


mongoose.connect('mongodb://localhost:27017/blog', {useNewUrlParser: true}, function (error) {
    if (error) {
        console.log('connected fail!');
        return;
    } else {
        console.log('connected success');
        app.listen(8081);
        console.log('Server in Running');
    }
})
