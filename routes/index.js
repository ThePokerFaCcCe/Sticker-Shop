var express = require('express');
var router = express.Router();

const api = require('./api');
const login = require("./login");
const signup = require("./signup");
const category = require("./category");
const item = require("./item");
const cart = require("./cart");
const admin = require('./admin/dashboard');
const profile = require('./profile/dashboard');
const homeParser = require(`${_HOME}/controllers/homepage`);



router.use(async (req, res, next) => {
    let token = req.session.token || req.cookies.token;
    if (token && token !== '0') {
        const user = await User.findOne({ where: { last_token: token } });
        req.userinfo = {};
        if (user) {
            req.user = user;
            // req.userinfo.user = user;
            if (req.cookies.token) {
                res.cookie('token', token, { maxAge: 360000000 });
            }
        }
    }
    req.categories = await Category.findAll();
    req.categories.unshift({ name: "همه" });
    next();
});

router.use('/admin', admin);

router.use(async (req, res, next) => {
    if (req.user) {
        req.shopcart = await Cart.findAll({ where: { user_id: req.user.id } });
    }
    next();
});

router.get('/', async (req, res) => {
    const params = await homeParser(req.categories, false);
    if (req.user && params.items.value.length > 0) {
        const likes = await Like.findAll({ where: { user_id: req.user.id } });
        for (const product of params.items.value) {
            for (const item of product.items) {
                const inCart = req.shopcart.filter((cart) => cart.item_id === item.id)[0];
                const liked = likes.filter((like) => like.item_id === item.id)[0];
                if (inCart) {
                    item.inCart = true;
                }
                if (liked) {
                    item.liked = true;
                }
            }
        }
    }
    res.render('home', { categories: req.categories, user: req.user, ...params });
});


router.use(async (req, res, next) => {
    req.headermsgs = await homeParser([], false, onlyMsg = true);
    req.important = { categories: req.categories, user: req.user, msgs: req.headermsgs };
    next();
});

router.use("/api", api);
router.use("/login", login);
router.use("/signup", signup);
router.use("/item", item);
router.use("/cart", cart);
router.use('/profile', profile);
router.use("/category", category);

router.all('/logout', async (req, res) => {
    if (req.user) {
        req.user.last_token = "0";
        await req.user.save();
    }
    req.session.destroy();
    res.clearCookie("token");

    res.redirect("/login");
});

module.exports = router;

